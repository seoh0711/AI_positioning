import { NextRequest, NextResponse } from "next/server";
import { generateWorkflowSteps } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { job, item } = await req.json();
    if (!job || !item) {
      return NextResponse.json({ error: "Missing job or item" }, { status: 400 });
    }
    const steps = await generateWorkflowSteps(job, item);
    return NextResponse.json(steps);
  } catch (error) {
    console.error("Workflow API Error:", error);
    return NextResponse.json({ error: "Workflow generation failed" }, { status: 500 });
  }
}
