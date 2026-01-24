import { MEETSHIKKHAI_SYSTEM_PROMPT } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, subject } = await req.json();

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenRouter API Key not configured on server" },
                { status: 500 }
            );
        }

        const subjectContext = `\n\nCONTEXT: Subject: ${subject}.`;
        const systemPrompt = MEETSHIKKHAI_SYSTEM_PROMPT + subjectContext;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "X-Title": "MeetShikkha AI"
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash-lite",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenRouter API Error:", errorData);
            throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "দুঃখিত, আমি উত্তর দিতে পারছি না। অনুগ্রহ করে আবার চেষ্টা করুন।";

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API Detailed Error:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            name: error.name
        });
        return NextResponse.json(
            { error: "Failed to generate response: " + error.message },
            { status: 500 }
        );
    }
}
