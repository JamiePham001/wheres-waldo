import { createScore } from "@/lib/db/queries";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, imageId } = body;
    const score = await createScore(userId, imageId);
    return Response.json({ success: true, data: score }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}