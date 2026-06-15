import { getRankById } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing ID" },
      { status: 400 },
    );
  }

  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 },
    );
  }

  try {
    const rank = await getRankById(numericId);

    if (!rank) {
      return NextResponse.json(
        { success: false, error: "Rank not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, rank });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
