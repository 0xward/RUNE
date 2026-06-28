import { NextResponse } from "next/server";
import { getMockSnapshot } from "@/lib/intelligence/snapshot";

export async function GET() {
  return NextResponse.json({ data: getMockSnapshot(), generatedAt: new Date().toISOString() });
}
