import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabase
    .from("watchlists")
    .select("id, name, topic_ids, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json() as { name: string; topic_ids: string[]; user_id: string };
  const { data, error } = await supabase
    .from("watchlists")
    .insert({ name: body.name, topic_ids: body.topic_ids, user_id: body.user_id })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
