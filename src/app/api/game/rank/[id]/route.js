import { getRankById } from "@/lib/db/queries";

export async function GET(_request, { params }) {
  const id = Number(params.id);

  if (!params.id) {
    return Response.json(
      { success: false, error: "Missing some ID" },
      { status: 400 },
    );
  }

  if (Number.isNaN(id)) {
    return Response.json(
      { success: false, error: "Invalid ID" },
      { status: 400 },
    );
  }

  try {
    const rank = await getRankById(id);

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