import { finishScore } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.scoreId) {
      return NextResponse.json(
        { success: false, error: "Missing score ID" },
        { status: 400 },
      );
    }

    const numericId = Number(body.scoreId);

    if (Number.isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: "Invalid score ID" },
        { status: 400 },
      );
    }

    const finishedScore = await finishScore(numericId);

    if (!finishedScore) {
      return NextResponse.json(
        { success: false, error: "Score not found or already finished" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: finishedScore });
  } catch (error) {
    console.error("Scoreboard API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
