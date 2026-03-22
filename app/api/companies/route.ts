/**
 * GET /api/companies — returns all companies with their latest signals, contacts, and revenue.
 */

import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET() {
  try {
    // const companies = await prisma.company.findMany({
    //   include: {
    //     signals: {
    //       orderBy: { createdAt: "desc" },
    //       take: 5,
    //     },
    //     contacts: {
    //       orderBy: { createdAt: "desc" },
    //       take: 10,
    //     },
    //     revenueRecords: {
    //       orderBy: { year: "desc" },
    //       take: 5,
    //     },
    //   },
    //   orderBy: { name: "asc" },
    // });

    // return NextResponse.json(companies);

    return NextResponse.json({
      message: "Connect database and uncomment Prisma queries to activate",
    });
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
