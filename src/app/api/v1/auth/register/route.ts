import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
import type {NextRequest} from "next/server"
import bcrypt from "bcryptjs"
import {z} from "zod"


const registerSchema = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long.")
    .max(20, "Username must be at most 20 characters long."),

  email: z
    .string()
    .email("Invalid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
});

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();


    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          errors: result.error.issues,
        },
        { status: 400 }
      );
    }


    const { username, email, password } = result.data;


    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }


    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}