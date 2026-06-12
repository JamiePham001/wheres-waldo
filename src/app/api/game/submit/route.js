import { submitScore } from "@/lib/db/queries";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { scoreId } = body;
    const score = await submitScore(scoreId);
    return Response.json({ success: true, data: score });
  } catch (error) {
    return Response.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}