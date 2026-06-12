import { getTopScoresForImage } from "@/lib/db/queries";

export async function GET(_request, { params }) {
  const id = Number(params.id);

  if (!params.id) {
    return Response.json(
      { success: false, error: "Missing some ID" },
      { status: 400 },
    );
  }

  if (Number.isNaN(id)) {
    return Response.json(
      { success: false, error: "Invalid image ID" },
      { status: 400 },
    );
  }

  try {
    const topScores = await getTopScoresForImage(id);

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