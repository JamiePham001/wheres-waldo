import { getAllMaps } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const maps = await getAllMaps();

    if (!maps) {
      return NextResponse.json(
        { success: false, error: "No maps found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: maps });
  } catch (error) {
    console.error("Error fetching maps:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
