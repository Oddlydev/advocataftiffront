import { NextApiRequest, NextApiResponse } from 'next';

import { VertexAI, type VertexInit } from '@google-cloud/vertexai';

// Initialize Vertex AI
// Ensure you have GCP_PROJECT_ID and GCP_LOCATION in your .env.local
const project = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_LOCATION || 'us-central1';

const serviceAccountBase64 = process.env.GCP_SERVICE_ACCOUNT_BASE64?.trim();
let googleAuthOptions: VertexInit['googleAuthOptions'];

if (serviceAccountBase64) {
    try {
        const parsedCredentials = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));
        googleAuthOptions = { credentials: parsedCredentials };
        console.log('Vertex AI will use service account credentials decoded from GCP_SERVICE_ACCOUNT_BASE64.');
    } catch (error) {
        console.warn('Failed to parse GCP_SERVICE_ACCOUNT_BASE64, falling back to default ADC flow.', error);
    }
}

const vertexInit: VertexInit = {
    project: project || 'advocata-frontend',
    location,
};

if (googleAuthOptions) {
    vertexInit.googleAuthOptions = googleAuthOptions;
}

const vertex_ai = new VertexAI(vertexInit);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { datasetUrl, prompt } = req.body;

    if (!datasetUrl) {
        return res.status(400).json({ message: 'Dataset URL is required' });
    }

    try {
        // Fetch the CSV content
        const csvResponse = await fetch(datasetUrl);
        if (!csvResponse.ok) {
            throw new Error('Failed to fetch CSV file');
        }
        const csvText = await csvResponse.text();

        // Construct the prompt
        const systemPrompt = `
      You are an expert data analyst. Analyze the following CSV dataset and provide insights in a specific JSON format.
      
      The output must be a valid JSON object with the following structure:
      {
        "keyInsights": [
          {
            "title": "Short title of the insight",
            "content": "Concise description of the insight (1-2 sentences)",
            "confidence": "High/Medium/Low (Percentage)"
          }
        ],
        "composition": {
          "introParagraphs": ["Paragraph 1", "Paragraph 2"],
          "growthSummary": "Summary of growth",
          "firstMetrics": ["Metric 1", "Metric 2"],
          "secondMetrics": ["Metric 1", "Metric 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "trend": {
          "intro": "Intro text",
          "disruptionParagraph": "Text about disruptions",
          "longTermTrends": ["Trend 1", "Trend 2"],
          "emergingPattern": "Text about emerging patterns",
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "ranking": {
          "intro": "Intro text",
          "stabilityRanking": ["Rank 1", "Rank 2"],
          "linkTexts": ["Link text 1", "Link text 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "dataQuality": {
          "intro": "Intro text",
          "missingDataSummary": "Summary of missing data",
          "breakdown": ["Breakdown 1", "Breakdown 2"],
          "timeline": ["Timeline 1", "Timeline 2"],
          "outliers": ["Outlier 1", "Outlier 2"],
          "checks": ["Check 1", "Check 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "forecast": {
          "intro": "Intro text",
          "forecastSummary": "Summary of forecast",
          "categoryProjections": ["Proj 1", "Proj 2"],
          "validationNotes": ["Note 1", "Note 2"],
          "riskFactors": ["Risk 1", "Risk 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "dataset": {
          "intro": "Intro text",
          "enhancements": ["Enhancement 1", "Enhancement 2"],
          "fileFormats": ["Format 1", "Format 2"],
          "newColumns": ["Col 1", "Col 2"],
          "qaChecks": ["Check 1", "Check 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        }
      }

      Ensure the insights are data-driven and accurate based on the provided CSV.
      If the dataset is small or lacks certain information, make reasonable inferences or state limitations, but always return the full JSON structure.
      
      CSV Data:
      ${csvText}
    `;

        // Initialize Gemini model
        // Try multiple models in sequence, prioritizing those found in the user's available list
        let result;
        const modelsToTry = [
            'gemini-2.5-flash', // Standard Vertex AI model
            'gemini-1.5-pro-001',
            'gemini-1.0-pro-001'
        ];
        let lastError;

        console.log(`Using GCP Project: ${project || 'Missing (using default)'}, Location: ${location}`);

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to use model: ${modelName}`);
                // Use getGenerativeModel from Vertex AI
                const generativeModel = vertex_ai.preview.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        responseMimeType: "application/json",
                        maxOutputTokens: 8192,
                    }
                });

                const req = {
                    contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
                };

                const streamingResp = await generativeModel.generateContentStream(req);
                const aggregatedResponse = await streamingResp.response;

                // Vertex AI response structure is slightly different, but usually has candidates[0].content.parts[0].text
                if (aggregatedResponse.candidates && aggregatedResponse.candidates[0].content && aggregatedResponse.candidates[0].content.parts && aggregatedResponse.candidates[0].content.parts[0].text) {
                    result = aggregatedResponse.candidates[0].content.parts[0].text;
                    console.log(`Successfully generated content with ${modelName}`);
                    break; // Success, exit loop
                } else {
                    throw new Error("Empty response from Vertex AI");
                }

            } catch (error: any) {
                console.warn(`Failed with model ${modelName}: ${error.message}`);
                lastError = error;

                // Continue on common recoverable errors
                if (
                    error.message.includes('404') ||
                    error.message.includes('not found') ||
                    error.message.includes('429') ||
                    error.message.includes('quota') ||
                    error.message.includes('503')
                ) {
                    continue;
                }
            }
        }

        if (!result) {
            throw lastError || new Error("Failed to generate insights with any available model.");
        }

        let text = result;

        // Clean up markdown code blocks if present (common with gemini-pro)
        // Extract the first balanced JSON object so trailing logs do not block parsing.
        const extractJsonObject = (payload: string) => {
            const start = payload.indexOf("{");
            if (start === -1) {
                return null;
            }

            let depth = 0;
            for (let i = start; i < payload.length; i++) {
                const chr = payload[i];
                if (chr === "{") {
                    depth += 1;
                } else if (chr === "}") {
                    depth -= 1;
                    if (depth === 0) {
                        return payload.substring(start, i + 1);
                    }
                }
            }

            return null;
        };

        const jsonPayload = extractJsonObject(text);
        const normalizedText = jsonPayload ?? text;

        try {
            const jsonResponse = JSON.parse(normalizedText);
            res.status(200).json(jsonResponse);
        } catch (e) {
            console.error("Failed to parse JSON response", normalizedText);
            res.status(500).json({ message: 'Failed to parse AI response', raw: normalizedText });
        }

    } catch (error: any) {
        console.error('Error generating insights:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
