import { getOrderedLevels } from "@/lib/db/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const orderedLevels = await getOrderedLevels();
    res.status(200).json({ success: true, data: orderedLevels });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
