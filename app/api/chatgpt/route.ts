import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { question } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant that provides quality information to user and answers are precise and to the point and well formatted.",
          },
          {
            role: "user",
            content: `Tell me in greater details ${question} `,
          },
        ],
      }),
    });
    const responseData = await response.json();
    const reply = responseData.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.log("error while generating answer", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
