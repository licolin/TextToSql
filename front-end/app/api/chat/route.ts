import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { question, model } = await request.json();
        // console.log("prompt "+);

        // Replace with your LLM API call (e.g., OpenAI API)
        const llmResponse = await fetch("http://localhost:8000/ask_question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model:model,
                question:question,
            }),
        });

        if (!llmResponse.ok) {
            throw new Error("Failed to fetch LLM response.");
        }

        const data = await llmResponse.json();
        console.log("data "+JSON.stringify(data));
        const reply = data.response;

        return NextResponse.json({ reply });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
