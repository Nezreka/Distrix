import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Internal Error", { status: 500 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not found", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages not found", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
        },
        ...messages,
      ],
    });
    //console.log("response.choises[0]", response.choices[0])
    console.log("response.choises[0].message", response.choices[0].message);
    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
  }
}
