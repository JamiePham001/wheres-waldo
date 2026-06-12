import { getRankById } from "@/lib/db/queries";

export async function GET(_request, { params }) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return Response.json(
      { success: false, error: "Invalid ID" },
      { status: 400 },
    );
  }

  try {
    const rank = await getRankById(numericId);

    if (!rank) {
      return Response.json(
        { success: false, error: "Rank not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, rank });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
