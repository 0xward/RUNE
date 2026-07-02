import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json() as { name: string; description?: string };
  const { data, error } = await supabase
    .from("topics")
    .upsert({ name: body.name, description: body.description ?? null }, { onConflict: "name" })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
