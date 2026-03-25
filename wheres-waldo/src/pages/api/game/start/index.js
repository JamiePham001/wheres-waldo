import { createScore } from "@/lib/db/queries";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { userId, imageId } = req.body;
    const score = await createScore(userId, imageId);
    return res.status(201).json({ success: true, data: score });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
