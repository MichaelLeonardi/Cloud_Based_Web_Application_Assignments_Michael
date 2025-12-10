import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.leaderboard.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/leaderboard/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { playerName } = body;

    if (!playerName) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const updatedEntry = await prisma.leaderboard.update({
      where: { id },
      data: { playerName },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("PUT /api/leaderboard/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
