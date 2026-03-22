/**
 * GET /api/companies/:id — returns a single company's full profile.
 */

import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // const company = await prisma.company.findUnique({
    //   where: { id },
    //   include: {
    //     signals: { orderBy: { createdAt: "desc" } },
    //     contacts: { orderBy: { createdAt: "desc" } },
    //     revenueRecords: { orderBy: { year: "desc" } },
    //   },
    // });

    // if (!company) {
    //   return NextResponse.json({ error: "Company not found" }, { status: 404 });
    // }

    // return NextResponse.json(company);

    return NextResponse.json({
      message: `Company ${id}: connect database and uncomment Prisma queries to activate`,
    });
  } catch (error) {
    console.error("Failed to fetch company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
