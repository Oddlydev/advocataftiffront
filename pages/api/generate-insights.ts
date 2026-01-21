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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { datasetUrl, prompt, datasetDescription, datasetTitle } = req.body;

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

        const titleSection =
            datasetTitle && typeof datasetTitle === "string"
                ? `Dataset title:\n${datasetTitle}\n`
                : "";
        const descriptionSection =
            datasetDescription && typeof datasetDescription === "string"
                ? `Dataset description:\n${datasetDescription}\n`
                : "";

        const systemPrompt = `
You are an expert data analyst.

You receive:
- the full CSV dataset, and
- metadata about the dataset (title/description/row counts).

Treat the CSV as the authoritative source of truth. Use metadata only as supporting context.
Do not include metadata in insights unless it directly helps interpret the dataset.
Do not invent values beyond what the dataset implies.

${titleSection}${descriptionSection}

Dataset header:
${headerLine}

Total data rows processed: ${dataRows.length}

Full CSV dataset:
${csvText}

Now produce a valid JSON object with the structure below that reflects those inputs.

ANALYTICAL QUALITY RULES:
- Each insight must synthesise information across multiple rows, fields, or periods where possible.
- Do not include any insight that could reasonably be written without inspecting the dataset or summaries.
- Avoid generic statements such as “there is an upward trend” unless the trend has distinguishing characteristics (e.g. consistency, volatility, reversals, relative strength).
- Prefer relative, comparative, or structural descriptions over single-row observations.

CONFIDENCE GUIDANCE:
- High confidence: pattern appears consistently across the dataset with minimal contradiction.
- Medium confidence: pattern is present but uneven, interrupted, or limited to subsets.
- Low confidence: signal is weak, sparse, or highly variable.

FORECASTING RULES:
- Forecasts must be strictly pattern-based and contingent on observed trends.
- Do not imply certainty or causal drivers.
- Clearly reflect uncertainty and data limitations.

OUTPUT REQUIREMENTS:
- Always emit the full JSON schema shown below.
- Always emit at least two objects in "keyInsights" if more than 10 data rows or multiple patterns are evident.
- Do not repeat the same observation across multiple sections using different wording.

If an insight cannot be clearly justified by the data provided, it must be omitted.
{
  "keyInsights": [
    {
      "title": "Short title of the insight",
      "content": "Concise description of the insight (1-2 sentences)",
      "confidence": "High/Medium/Low (Percentage)"
    }
  ],
  "moreInsights": [
    {
      "title": "Short card title",
      "description": "Short summary shown on the card",
      "detail": {
        "summary": "1-2 sentence summary of the detail view",
        "sections": [
          {
            "title": "Section title",
            "body": "Short paragraph of supporting context",
            "bullets": ["Bullet 1", "Bullet 2"]
          }
        ]
      }
    }
  ]
}

Ensure "moreInsights" has 4-6 entries, and the detail content is grounded in the dataset.

Ensure the JSON reflects the sequential summaries, even if some rows were indirectly covered. Always include the full schema shown above.

Always emit at least two objects inside \`"keyInsights"\` if there is evidence of multiple patterns or more than 10 data rows. If the dataset is richer, feel free to extend beyond two insights while keeping them concise (1-2 sentences each) and do not repeat identical observations.
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
