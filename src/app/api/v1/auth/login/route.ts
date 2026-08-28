import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          errors: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

  
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }


    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }


    const accessToken = await new SignJWT({
      id: user.id,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setExpirationTime("15m")
      .sign(
        new TextEncoder().encode(
          process.env.JWT_ACCESS_SECRET!
        )
      );


    const refreshToken = await new SignJWT({
      id: user.id,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setExpirationTime("7d")
      .sign(
        new TextEncoder().encode(
          process.env.JWT_REFRESH_SECRET!
        )
      );

  
    const response = NextResponse.json(
      {
        message: "Logged in successfully",
     
      },
      { status: 200 }
    );


    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });


    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}