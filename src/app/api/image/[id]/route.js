import { getMapById } from "@/lib/db/queries";

export async function GET(_request, { params }) {
  const id = Number(params.id);

  if (!params.id) {
    return Response.json(
      { success: false, error: "Missing map ID" },
      { status: 400 },
    );
  }

  if (Number.isNaN(id)) {
    return Response.json(
      { success: false, error: "Invalid map ID" },
      { status: 400 },
    );
  }

  try {
    const map = await getMapById(id);

    if (!map) {
      return Response.json(
        { success: false, error: "Map not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: map });
  } catch {
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}