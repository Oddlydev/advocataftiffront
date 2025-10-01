import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Missing url" });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch dataset" });
        }

        const text = await response.text();
        res.setHeader("Content-Type", "text/csv");
        res.status(200).send(text);
    } catch (err) {
        res.status(500).json({ error: "Internal proxy error" });
    }
}
