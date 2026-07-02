import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabase
    .from("forecasts")
    .select("id, probability, horizon, summary, evidence, model_provider, created_at, topics(name)")
    .order("created_at", { ascending: false })
    .limit(9);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
