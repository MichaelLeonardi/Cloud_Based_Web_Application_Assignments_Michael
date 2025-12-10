import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, timeTaken, status } = body;

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

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("POST /api/leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const leaderboard = await prisma.leaderboard.findMany({
        orderBy: {
          timeTaken: "asc",
        },
      });
  
      return NextResponse.json(leaderboard, { status: 200 });
    } catch (error) {
      console.error("GET /api/leaderboard error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }
  }
  
