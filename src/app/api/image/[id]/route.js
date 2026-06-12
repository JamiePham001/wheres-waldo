// Next.js API route to fetch map data by ID

import { getMapById } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing map ID" }, { status: 400 });
    }

    const map = await getMapById(numericId);

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    return NextResponse.json({ data: map }, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
