import { finishScore } from "@/lib/db/queries";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { scoreId } = body;
    const finishedScore = await finishScore(scoreId);
    return Response.json({ success: true, data: finishedScore });
  } catch (error) {
    return Response.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}