import { getOrderedLevels } from "@/lib/db/queries";

export async function GET() {
  try {
    const orderedLevels = await getOrderedLevels();
    return Response.json({ success: true, data: orderedLevels });
  } catch {
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}