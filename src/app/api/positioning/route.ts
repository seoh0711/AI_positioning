import { NextResponse } from "next/server";
import { getPositioning } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { job, lang } = await req.json();

    if (!job) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const result = await getPositioning(job);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
