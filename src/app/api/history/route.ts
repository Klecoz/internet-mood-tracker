import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("mood_runs")
    .select("id, generated_at, mood, confidence")
    .order("generated_at", { ascending: false })
    .limit(14);

  if (error) {
    return NextResponse.json({ history: [] }, { status: 200 });
  }

  return NextResponse.json({ history: data ?? [] });
}
