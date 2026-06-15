import { submitScore } from "@/lib/db/queries";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.scoreId) {
      return NextResponse.json(
        { success: false, error: "Missing score ID" },
        { status: 400 },
      );
    }

    const numericId = Number(body.scoreId);
    const score = await submitScore(numericId);

    if (!score) {
      return NextResponse.json(
        { success: false, error: "Score not found or already submitted" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: score });
  } catch (error) {
    return Response.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
