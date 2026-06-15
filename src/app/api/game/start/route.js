import { createScore } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const { userId, imageId } = body;

    if (!userId || !imageId) {
      return NextResponse.json(
        { success: false, error: "Missing userId or imageId" },
        { status: 400 },
      );
    }

    const score = await createScore(userId, imageId);

    if (!score) {
      return NextResponse.json(
        { success: false, error: "Failed to create score" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: score }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
