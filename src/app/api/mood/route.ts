import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: moodRun, error } = await supabase
    .from("mood_runs")
    .select("*")
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !moodRun) {
    return NextResponse.json({ moodRun: null }, { status: 200 });
  }

  const [{ data: themes }, { data: sources }] = await Promise.all([
    supabase
      .from("mood_themes")
      .select("*")
      .eq("mood_run_id", moodRun.id)
      .order("rank"),
    supabase
      .from("source_items")
      .select("*")
      .eq("mood_run_id", moodRun.id)
      .limit(15),
  ]);

  return NextResponse.json({
    moodRun: {
      ...moodRun,
      mood_themes: themes ?? [],
      source_items: sources ?? [],
    },
  });
}
