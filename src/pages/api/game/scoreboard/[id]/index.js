import { getTopScoresForImage } from "@/lib/db/queries";

export default async function handlers(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "Missing some ID" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const imageId = parseInt(id, 10);

    if (isNaN(imageId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid image ID" });
    }

    const topScores = await getTopScoresForImage(imageId);

    if (!topScores) {
      return res
        .status(404)
        .json({ success: false, error: "Scores not found" });
    }
    res.status(200).json({ success: true, scores: topScores });
  } catch (error) {
    console.error("Scoreboard API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
