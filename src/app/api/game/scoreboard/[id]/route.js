import { getTopScoresForImage } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing map ID" }, { status: 400 });
  }

  try {
    const topScores = await getTopScoresForImage(numericId);

    if (!topScores) {
      return NextResponse.json(
        { success: false, error: "Scores not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, scores: topScores });
  } catch (error) {
    console.error("Scoreboard API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
