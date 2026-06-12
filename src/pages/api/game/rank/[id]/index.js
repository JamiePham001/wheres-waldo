import { getRankById } from "@/lib/db/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(406)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "Missing some ID" });
  }

  try {
    const rank = await getRankById(Number(id));

    if (!rank) {
      return res.status(404).json({ success: false, error: "Rank not found" });
    }

    return res.status(200).json({ success: true, rank });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
