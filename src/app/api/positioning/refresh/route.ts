import { NextResponse } from "next/server";
import { getPartialPositioning } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { job, category } = await req.json();

    if (!job || !category) {
      return NextResponse.json({ error: "Job and category are required" }, { status: 400 });
    }

    const validCategories = ["automation", "ai_enhanced", "creative"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const result = await getPartialPositioning(job, category as any);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Refresh API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
