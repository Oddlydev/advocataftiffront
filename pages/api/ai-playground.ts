import { NextApiRequest, NextApiResponse } from "next";

import { VertexAI, type VertexInit } from "@google-cloud/vertexai";

const project = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_LOCATION || "us-central1";

const serviceAccountBase64 = process.env.GCP_SERVICE_ACCOUNT_BASE64?.trim();
let googleAuthOptions: VertexInit["googleAuthOptions"];

if (serviceAccountBase64) {
  try {
    const parsedCredentials = JSON.parse(
      Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
    );
    googleAuthOptions = { credentials: parsedCredentials };
    console.log(
      "Vertex AI playground will use service account credentials decoded from GCP_SERVICE_ACCOUNT_BASE64."
    );
  } catch (error) {
    console.warn(
      "Failed to parse GCP_SERVICE_ACCOUNT_BASE64 for playground, falling back to default ADC flow.",
      error
    );
  }
}

const vertexInit: VertexInit = {
  project: project || "advocata-frontend",
  location,
};

if (googleAuthOptions) {
  vertexInit.googleAuthOptions = googleAuthOptions;
}

const vertex_ai = new VertexAI(vertexInit);

const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-1.5-pro-001",
  "gemini-1.0-pro-001",
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

  const normalized = parts
    .filter((chunk: any) => typeof chunk === "string" && chunk.length > 0)
    .join("");
  return normalized || null;
}

function isRecoverableError(message: string | undefined) {
  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes("404") ||
    normalized.includes("not found") ||
    normalized.includes("429") ||
    normalized.includes("quota") ||
    normalized.includes("503")
  );
}

async function generateFromVertex(prompt: string, options: { description: string; maxOutputTokens: number }) {
  let lastError: any;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Playground trying model: ${modelName} (${options.description})`);
      const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: options.maxOutputTokens,
        },
      });

      const request = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };

      const streamingResp = await generativeModel.generateContentStream(request);
      const aggregatedResponse = await streamingResp.response;
      const candidateText = aggregateCandidateContent(aggregatedResponse);

      if (candidateText) {
        return candidateText;
      }

      throw new Error("Empty response from Vertex AI");
    } catch (error: any) {
      console.warn(`Playground failed with model ${modelName}:`, error?.message || error);
      lastError = error;
      if (isRecoverableError(error?.message)) {
        continue;
      }
      break;
    }
  }

  throw lastError ?? new Error("Playground failed to generate content");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { datasetContent, datasetUrl, prompt } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  if (!datasetContent && !datasetUrl) {
    return res
      .status(400)
      .json({ message: "Dataset content or dataset URL is required" });
  }

  let csvText = datasetContent ?? "";
  if (!datasetContent && datasetUrl) {
    try {
      const csvResponse = await fetch(datasetUrl);
      if (!csvResponse.ok) {
        throw new Error("Failed to download dataset from provided URL");
      }
      csvText = await csvResponse.text();
    } catch (error: any) {
      console.error("Playground dataset fetch failed:", error);
      return res
        .status(502)
        .json({ message: "Failed to download dataset content", error: error?.message });
    }
  }

  try {
    const csvLines = csvText.split(/\r?\n/);
    const filteredLines = csvLines.filter((line: any) => line.trim().length > 0);
    const headerLine = filteredLines.shift() ?? "";
    const dataRows = filteredLines;

    const headers = splitCsvLine(headerLine);
    const structuredRows = dataRows.map((row: any) => {
      const cells = splitCsvLine(row);
      const label = cells[0] ?? "Row";
      const values = cells.slice(1);
      const mapped = values
        .map((value, index) => {
          const year = headers[index + 1] ?? `col${index + 1}`;
          return `${year}: ${value}`;
        })
        .join("  ");
      return `${label} -> ${mapped}`;
    });

    const datasetPayload = [
      `Header: ${headers.join(", ")}`,
      ...structuredRows,
    ].join("\n");

    const finalPrompt = `
Dataset content (structured per item):
${datasetPayload}

User prompt:
${prompt.trim()}
`;

    console.log(`Playground using GCP Project: ${project || "Missing (default)"}, Location: ${location}`);
    const finalResult = await generateFromVertex(finalPrompt, {
      description: "playground insights response",
      maxOutputTokens: 8192,
    });

    const insightText = finalResult.trim();
    const responsePayload = {
      keyInsights: [
        {
          title: prompt.trim(),
          content: insightText,
          confidence: "n/a",
        },
      ],
    };

    res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error("Playground error:", error);
    res.status(500).json({ message: "Internal server error", error: error?.message });
  }
}

const splitCsvLine = (line: string) => {
  const cells = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  return cells.map((cell) => cell.replace(/^"|"$/g, "").trim());
};
