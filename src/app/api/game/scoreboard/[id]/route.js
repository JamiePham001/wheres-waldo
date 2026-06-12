import { getTopScoresForImage } from "@/lib/db/queries";

export async function GET(req, { params }) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing map ID" }, { status: 400 });
  }

  try {
    const topScores = await getTopScoresForImage(numericId);

    if (!topScores) {
      return Response.json(
        { success: false, error: "Scores not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, scores: topScores });
  } catch (error) {
    console.error("Scoreboard API error:", error);
    return Response.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
