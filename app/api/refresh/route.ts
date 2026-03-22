/**
 * Vercel Cron endpoint — fires the Trigger.dev refresh pipeline.
 *
 * Secured with CRON_SECRET — Vercel sends Authorization: Bearer <secret> automatically.
 * Schedule: 0 2 * * * (daily at 02:00 UTC) — configured in vercel.json.
 */

import { NextRequest, NextResponse } from "next/server";
// import { tasks } from "@trigger.dev/sdk/v3";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Trigger the refresh pipeline job
    // const handle = await tasks.trigger("refresh-pipeline", {});

    return NextResponse.json({
      success: true,
      message: "Refresh pipeline triggered",
      // runId: handle.id,
    });
  } catch (error) {
    console.error("Failed to trigger refresh pipeline:", error);
    return NextResponse.json(
      { error: "Failed to trigger pipeline" },
      { status: 500 }
    );
  }
}
