import { NextResponse } from "next/server";
import { providers } from "@/lib/intelligence/mock-data";

export async function GET() {
  return NextResponse.json({ data: providers, count: providers.length });
}
