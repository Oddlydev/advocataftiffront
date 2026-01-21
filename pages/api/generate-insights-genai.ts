import { NextApiRequest, NextApiResponse } from "next";

import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-2.0-lite",
];
const CHUNK_SIZE = 25;
const MAX_CHUNK_SUMMARY_TOKENS = 256;

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenerativeAI(apiKey);
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

async function generateFromGemini(
  prompt: string,
  options: { description: string; maxOutputTokens: number; responseMimeType?: string }
) {
  const genAI = getGenAIClient();
  let lastError: any;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: options.responseMimeType ?? "application/json",
          maxOutputTokens: options.maxOutputTokens,
        },
      });

      const responseText = result.response.text();
      if (!responseText) {
        throw new Error(`Empty response from Gemini (${options.description})`);
      }

      return responseText;
    } catch (error: any) {
      console.warn(`Failed with model ${modelName}: ${error?.message || error}`);
      lastError = error;
      if (isRecoverableError(error?.message)) {
        continue;
      }
      break;
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
      const chunkSummary = await generateFromGemini(chunkPrompt, {
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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { datasetUrl, prompt, datasetDescription } = req.body;

  if (!datasetUrl) {
    return res.status(400).json({ message: "Dataset URL is required" });
  }

  try {
    const csvResponse = await fetch(datasetUrl);
    if (!csvResponse.ok) {
      throw new Error("Failed to fetch CSV file");
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

    const descriptionSection =
      datasetDescription && typeof datasetDescription === "string"
        ? `Dataset description:\n${datasetDescription}\n`
        : "";

    const systemPrompt = `
You are an expert data analyst. You receive the sequential summaries generated from every row of the dataset below
and must use those summaries, plus the header, as the canonical view of the data. You may describe patterns referencing "earlier rows" or "later sections" if it helps,
but do not mention "chunks" or numeric chunk labels in the insights text, and do not invent values beyond what the summaries imply.

${descriptionSection}
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
  "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "methodology": "1-2 sentence summary of the analytical approach used.",
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
        ],
        "recommendations": ["Recommendation 1", "Recommendation 2"]
      }
    }
  ]
}

Ensure "moreInsights" has 4-6 entries, and the detail content is grounded in the dataset.
Use "takeaways" to provide 3-5 concise bullets summarizing the most important insights, and "methodology" to describe the analysis approach in a short paragraph.

Ensure the JSON reflects the sequential summaries, even if some rows were indirectly covered. Always include the full schema shown above.

Always emit at least two objects inside \`"keyInsights"\` if there is evidence of multiple patterns or more than 10 data rows. If the dataset is richer, feel free to extend beyond two insights while keeping them concise (1-2 sentences each) and do not repeat identical observations.
`;

    const finalResult = await generateFromGemini(systemPrompt, {
      description: "insights response",
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    });

    const normalizedText = extractJsonObject(finalResult) ?? finalResult;

    try {
      const jsonResponse = JSON.parse(normalizedText);
      res.status(200).json(jsonResponse);
    } catch (e) {
      console.error("Failed to parse JSON response", normalizedText);
      res.status(500).json({ message: "Failed to parse AI response", raw: normalizedText });
    }
  } catch (error: any) {
    console.error("Error generating insights:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
