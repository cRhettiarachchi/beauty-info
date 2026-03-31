/**
 * GET /api/companies/:id — returns a single company's full profile.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("companies")
      .select("*, signals(*), contacts(*), revenue_records(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
