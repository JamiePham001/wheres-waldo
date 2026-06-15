import { getOrderedLevels } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orderedLevels = await getOrderedLevels();

    if (!orderedLevels) {
      return NextResponse.json(
        { success: false, error: "No ordered levels found" },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true, data: orderedLevels });
  } catch (error) {
    console.error("Error fetching ordered levels:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
