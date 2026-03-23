import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPrompt } from "@/lib/prompt";
import { Resume } from "@/types/resume";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const {
            resume,
            jobDescription,
        }: { resume: Resume; jobDescription: string } = await req.json();

        if (!resume || !jobDescription) {
            return NextResponse.json(
                { error: "Missing resume or job description" },
                { status: 400 },
            );
        }

        const prompt = buildPrompt(resume, jobDescription);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3, // low temp = more consistent, structured output
        });

        const raw = completion.choices[0].message.content ?? "";

        const tailored: Resume = JSON.parse(raw);

        return NextResponse.json({ resume: tailored });
    } catch (err) {
        console.error("Tailor API error:", err);
        return NextResponse.json(
            { error: "Failed to process resume" },
            { status: 500 },
        );
    }
}
