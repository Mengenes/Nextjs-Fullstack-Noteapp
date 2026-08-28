import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, SignJWT } from "jose";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_REFRESH_SECRET || !JWT_ACCESS_SECRET) {
  throw new Error("JWT secrets are not defined");
}

export async function POST(req: NextRequest) {
  try {

    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }


    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(JWT_REFRESH_SECRET)
    );

    if (!payload.id || typeof payload.id !== "string") {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

  
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        username: true
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
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
        new TextEncoder().encode(JWT_ACCESS_SECRET)
      );

  
    const response = NextResponse.json(
      {
        message: "Token refreshed",
        user: {
          id: user.id,
          username: user.username
        },
      },
      { status: 200 }
    );

    
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);

    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}