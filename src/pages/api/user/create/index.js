import { createUser, getUserByName } from "@/lib/db/queries";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET;

const validateUsername = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .custom(async (username) => {
      // Your existing duplicate check query
      const userExists = await getUserByName(username);
      if (userExists) {
        throw new Error("Username already exists");
      }
      return true; // Validation passed
    }),
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  await Promise.all(validateUsername.map((validation) => validation.run(req)));

  const { name } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  if (!name) {
    return res.status(400).json({ success: false, error: "Missing user name" });
  }

  try {
    const user = await createUser(name);
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "2weeks",
    });

    return res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
