import { getAllMaps } from "@/lib/db/queries";

export async function GET() {
  try {
    const maps = await getAllMaps();
    return Response.json({ success: true, data: maps });
  } catch {
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}