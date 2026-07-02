import { NextResponse } from "next/server";
import { buildRealSnapshot } from "@/lib/intelligence/pipeline";

export const runtime = "nodejs";
export const maxDuration = 60;
export const revalidate = 0;

export async function GET() {
  try {
    const snapshot = await buildRealSnapshot();
    return NextResponse.json({ data: snapshot, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[snapshot]", err);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
