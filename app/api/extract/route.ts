import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { jobDescription } = await req.json();

        if (!jobDescription) {
            return NextResponse.json({ company: "company" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Extract only the company name from this job description. Return just the company name with no punctuation, nothing else, no explanation.\n\n${jobDescription}`,
                },
            ],
            max_tokens: 20,
            temperature: 0,
        });

        const company =
            completion.choices[0].message.content?.trim() ?? "company";

        return NextResponse.json({ company });
    } catch {
        return NextResponse.json({ company: "company" });
    }
}
