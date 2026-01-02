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

const MODELS_TO_TRY = [
    'gemini-2.5-flash',
    'gemini-1.5-pro-001',
    'gemini-1.0-pro-001',
];

const CHUNK_SIZE = 25;
const MAX_CHUNK_SUMMARY_TOKENS = 256;

function aggregateCandidateContent(response: any) {
    const candidate = response?.candidates?.[0];
    const content = candidate?.content ?? candidate?.lambdaResponse?.content;
    if (!content) {
        return null;
    }

    const parts = (content.parts ?? []).map((part: any) => part?.text ?? "");
    if (content.text) {
        parts.push(content.text);
    }

    const normalized = parts.filter((chunk: any) => typeof chunk === "string" && chunk.length > 0).join("");
    return normalized || null;
}

function isRecoverableError(message: string | undefined) {
    if (!message) {
        return false;
    }

    const normalized = message.toLowerCase();
    return (
        normalized.includes('404') ||
        normalized.includes('not found') ||
        normalized.includes('429') ||
        normalized.includes('quota') ||
        normalized.includes('503')
    );
}

async function generateFromVertex(prompt: string, options: { description: string; maxOutputTokens: number; responseMimeType?: string; }) {
    let lastError: any;

    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Attempting to use model: ${modelName} (${options.description})`);
            const generativeModel = vertex_ai.preview.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: options.responseMimeType ?? "application/json",
                    maxOutputTokens: options.maxOutputTokens,
                },
            });

            const request = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            };

            const streamingResp = await generativeModel.generateContentStream(request);
            const aggregatedResponse = await streamingResp.response;
            const candidateText = aggregateCandidateContent(aggregatedResponse);

            if (candidateText) {
                return candidateText;
            }

            throw new Error("Empty response from Vertex AI");
        } catch (error: any) {
            console.warn(`Failed with model ${modelName}: ${error?.message || error}`);
            lastError = error;
            if (isRecoverableError(error?.message)) {
                continue; // try the next model
            }
            break; // fatal error
        }
    }

    throw lastError ?? new Error(`Failed to generate content (${options.description})`);
}

function extractJsonObject(payload: string) {
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
}

async function summarizeCsvChunks(rows: string[], header: string) {
    const summaries: string[] = [];

    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunkRows = rows.slice(i, i + CHUNK_SIZE);
        if (!chunkRows.length) {
            continue;
        }

        const chunkPrompt = `
Summarize the key patterns and numeric changes in the following CSV fragment in 1-2 sentences.
Highlight the most significant increase/decrease or concentration of values, referencing the column names.

Header: ${header}
${chunkRows.join("\n")}
`;

        try {
            const chunkSummary = await generateFromVertex(chunkPrompt, {
                description: `chunk ${Math.floor(i / CHUNK_SIZE) + 1} summary`,
                maxOutputTokens: MAX_CHUNK_SUMMARY_TOKENS,
                responseMimeType: "text/plain",
            });

            const normalized = chunkSummary.replace(/\s+/g, " ").trim();
            summaries.push(normalized);
        } catch (error) {
            console.warn(`Chunk summarization failed for rows ${i + 1}-${i + chunkRows.length}:`, error);
            const fallback = chunkRows.slice(0, 2).join(" | ");
            summaries.push(`Rows ${i + 1}-${i + chunkRows.length}: ${fallback}${chunkRows.length > 2 ? " ..." : ""}`);
        }
    }

    return summaries;
}

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

        const csvLines = csvText.split(/\r?\n/);
        const filteredLines = csvLines.filter((line) => line.trim().length > 0);
        const headerLine = filteredLines.shift() ?? "";
        const dataRows = filteredLines;

        const chunkSummaries = await summarizeCsvChunks(dataRows, headerLine);
        const chunkSummarySection =
            chunkSummaries.length > 0
                ? chunkSummaries
                      .map((summary, index) => `Summary ${index + 1}: ${summary}`)
                      .join("\n")
                : "No data rows were available to summarize.";

        const systemPrompt = `
You are an expert data analyst. You receive the sequential summaries generated from every row of the dataset below
and must use those summaries, plus the header, as the canonical view of the data. You may describe patterns referencing "earlier rows" or "later sections" if it helps,
but do not mention "chunks" or numeric chunk labels in the insights text, and do not invent values beyond what the summaries imply.

Dataset header:
${headerLine}
Total data rows processed: ${dataRows.length}

Chunk summaries:
${chunkSummarySection}

Now produce a valid JSON object with the structure below that reflects those summaries:
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

Ensure the JSON reflects the chunk summaries, even if some rows were indirectly covered. Always include the full schema shown above.
        `;

        console.log(`Using GCP Project: ${project || 'Missing (using default)'}, Location: ${location}`);
        const finalResult = await generateFromVertex(systemPrompt, {
            description: 'insights response',
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
        });

        const normalizedText = extractJsonObject(finalResult) ?? finalResult;

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
