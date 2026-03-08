import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    const apiKey = "AIzaSyDvT9XkS_ziF3GG9Oq4p5G8xSDSaRFibCo";
    const lastMessage = messages[messages.length - 1].content;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: "You are Yatin, an Android developer. Be casual and funny." }] },
                contents: messages.map((m: { role: string; content: string }) => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }))
            })
        }
    );

    const data = await res.json();
    console.log('STATUS:', res.status, JSON.stringify(data).substring(0, 300));

    if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
    return NextResponse.json({ message: data.candidates[0].content.parts[0].text });
}
