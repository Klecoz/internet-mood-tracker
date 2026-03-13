import { NextRequest, NextResponse } from "next/server";
import { runAnalysis } from "@/lib/analyze";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-secret");
  const expectedSecret = process.env.ANALYZE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const moodRun = await runAnalysis();
    return NextResponse.json({ moodRun });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
