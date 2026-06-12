import { submitScore } from "@/lib/db/queries";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { scoreId } = req.body;
    const score = await submitScore(scoreId);
    return res.status(200).json({ success: true, data: score });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
