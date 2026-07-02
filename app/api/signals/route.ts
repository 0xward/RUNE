import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const since = new Date(Date.now() - 86400000 * 3).toISOString();

  let query = supabase
    .from("signals")
    .select("id, title, source, source_url, observed_at, topics(name), signal_scores(momentum, confidence, velocity, strength)")
    .gte("observed_at", since)
    .order("observed_at", { ascending: false })
    .limit(50);

  if (topic) {
    const { data: topicRow } = await supabase.from("topics").select("id").eq("name", topic).single();
    if (topicRow) query = query.eq("topic_id", (topicRow as { id: string }).id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
