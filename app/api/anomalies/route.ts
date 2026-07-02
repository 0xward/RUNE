import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function GET() {
  const since = new Date(Date.now() - 86400000 * 7).toISOString();
  const { data, error } = await supabase
    .from("anomalies")
    .select("id, severity, summary, explanation, detected_at, topics(name)")
    .gte("detected_at", since)
    .order("detected_at", { ascending: false })
    .limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
