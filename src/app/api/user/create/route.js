import { createUser, getUserByName } from "@/lib/db/queries";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return Response.json(
        { success: false, error: "Missing user name" },
        { status: 400 },
      );
    }

    if (name.length < 3) {
      return Response.json(
        {
          message: "Validation failed",
          errors: [{ msg: "Username must be at least 3 characters" }],
        },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+$/i.test(name)) {
      return Response.json(
        {
          message: "Validation failed",
          errors: [{ msg: "Username must contain only letters and numbers" }],
        },
        { status: 400 },
      );
    }

    const userExists = await getUserByName(name);
    if (userExists) {
      return Response.json(
        {
          message: "Validation failed",
          errors: [{ msg: "Username already exists" }],
        },
        { status: 400 },
      );
    }

    const user = await createUser(name);
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "2weeks",
    });

    return Response.json({ success: true, data: { user, token } }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}