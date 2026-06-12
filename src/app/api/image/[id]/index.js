import { getMapById } from "@/lib/db/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "Missing map ID" });
  }

  try {
    const map = await getMapById(Number(id));

    if (!map) {
      return res.status(404).json({ success: false, error: "Map not found" });
    }
    return res.status(200).json({ success: true, data: map });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
