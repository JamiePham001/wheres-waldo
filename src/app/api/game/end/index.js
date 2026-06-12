import { finishScore } from "@/lib/db/queries";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { gameId } = req.body;
    const finishedScore = await finishScore(gameId);
    return res.status(200).json({ success: true, data: finishedScore });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
