import { NextResponse } from "next/server";

export function proxy(req, res) {
  return NextResponse.next();
}
