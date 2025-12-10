import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logInfo, logError, logPerf } from "@/lib/logger";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const start = performance.now();

  try {
    const body = await request.json();
    const { playerName, timeTaken, status } = body;

    logInfo("POST /api/leaderboard called", body);

    if (!playerName || !timeTaken || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEntry = await prisma.leaderboard.create({
      data: {
        playerName,
        timeTaken,
        status,
      },
    });

    const duration = performance.now() - start;
    logPerf("POST /api/leaderboard", Math.round(duration));

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    logError("POST /api/leaderboard error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const start = performance.now();

  try {
    logInfo("GET /api/leaderboard called");

    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: {
        timeTaken: "asc",
      },
    });

    const duration = performance.now() - start;
    logPerf("GET /api/leaderboard", Math.round(duration));

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    logError("GET /api/leaderboard error", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
