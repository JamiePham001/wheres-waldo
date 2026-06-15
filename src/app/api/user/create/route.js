import { NextResponse } from "next/server";
import { createUser, getUserByName } from "@/lib/db/queries";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // 1. Critical: Validate environment variables inside the function or at startup
    // If JWT_SECRET is undefined, jwt.sign() creates a severe security vulnerability
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error(
        "CRITICAL: JWT_SECRET is missing from environment variables.",
      );
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";

    // 2. Consistent Error Formatting
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Missing user name", errors: [] },
        { status: 400 },
      );
    }

    // 3. Add Maximum Length validation to prevent DoS or DB overflow errors
    if (name.length < 3 || name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: [{ msg: "Username must be between 3 and 50 characters" }],
        },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+$/i.test(name)) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: [{ msg: "Username must contain only letters and numbers" }],
        },
        { status: 400 },
      );
    }

    const userExists = await getUserByName(name);
    if (userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: [{ msg: "Username already exists" }],
        },
        // 4. Use 409 Conflict for existing resources instead of 400 Bad Request
        { status: 409 },
      );
    }

    const user = await createUser(name);

    // 5. Use standard duration format (14d)
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "14d",
    });

    return NextResponse.json(
      { success: true, data: { user, token } },
      { status: 201 },
    );
  } catch (error) {
    // 6. Only log the error internally, do not leak stack traces to the client
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
