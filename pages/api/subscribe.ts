import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

function md5(value: string) {
    return crypto.createHash("md5").update(value).digest("hex");
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
    try {
        return (await response.json()) as T;
    } catch (err) {
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, firstName, lastName, organisation, phone } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY || "";
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || "";
    const SERVER_PREFIX =
        process.env.MAILCHIMP_SERVER_PREFIX || API_KEY.split("-")[1];

    if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
        return res.status(500).json({ error: "Mailchimp not configured" });
    }

    const emailLower = email.toLowerCase();
    const subscriberHash = md5(emailLower);

    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}`;
    const authHeader = `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`;

    // Check if the contact already exists and is subscribed
    const existingResponse = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: authHeader,
        },
    });

    if (existingResponse.ok) {
        const existingData = await parseJsonSafe<{ status?: string }>(existingResponse);
        if (existingData?.status === "subscribed") {
            return res.status(409).json({ error: "You have already subscribed" });
        }
    } else if (existingResponse.status !== 404) {
        const errorData = await parseJsonSafe<{ detail?: string }>(existingResponse);
        return res
            .status(existingResponse.status)
            .json({ error: errorData?.detail || "Mailchimp error" });
    }

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        body: JSON.stringify({
            email_address: emailLower,
            status_if_new: "subscribed", // direct subscription
            merge_fields: {
                FNAME: firstName || "",
                LNAME: lastName || "",
                MERGE7: organisation || "",
                MERGE5: phone || "",
            },
        }),
    });

    const data = await parseJsonSafe<{ status?: string; detail?: string }>(response);
    if (!response.ok) {
        return res
            .status(response.status)
            .json({ error: data?.detail || "Mailchimp error" });
    }

    return res.status(200).json({ success: true, status: data?.status });
}