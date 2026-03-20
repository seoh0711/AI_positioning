import { NextRequest, NextResponse } from "next/server";
import { generateEbookContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { job, item } = await req.json();
    if (!job || !item) {
      return NextResponse.json({ error: "Missing job or item" }, { status: 400 });
    }
    const content = await generateEbookContent(job, item);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Ebook API Error:", error);
    return NextResponse.json({ error: "Ebook generation failed" }, { status: 500 });
  }
}
