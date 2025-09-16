import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

function md5(value: string) {
    return crypto.createHash("md5").update(value).digest("hex");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email } = req.body;
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

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
        },
        body: JSON.stringify({
            email_address: emailLower,
            status_if_new: process.env.MAILCHIMP_DOUBLE_OPT_IN === "true" ? "pending" : "subscribed",
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        return res.status(response.status).json({ error: data.detail || "Mailchimp error" });
    }

    return res.status(200).json({ success: true, status: data.status });
}
