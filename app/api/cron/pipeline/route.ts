import { NextResponse } from "next/server";
import { buildRealSnapshot } from "@/lib/intelligence/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const start = Date.now();
    const snapshot = await buildRealSnapshot();
    const duration = Date.now() - start;
    return NextResponse.json({
      ok: true,
      duration: `${duration}ms`,
      signals: snapshot.signals.length,
      anomalies: snapshot.anomalies.length,
      forecasts: snapshot.forecasts.length,
      score: snapshot.score,
      ran: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/pipeline]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
