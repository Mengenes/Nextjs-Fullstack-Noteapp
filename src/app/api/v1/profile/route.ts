import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCurrentUserId } from "@/lib/currentUser";


const profileSchema = z.object({
  username: z.string().min(6).max(20).optional(),
  email: z.email().optional(),
  password: z.string().optional(),
});

const deleteAccountSchema = z.object({
  currentPassword: z.string().min(1, "Password is required"),
});

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data" },
        { status: 400 }
      );
    }

    if (!result.data.username && !result.data.email) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    if (result.data.username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username: result.data.username,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUsername) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 400 }
        );
      }
    }

    if (result.data.email) {
      if (!result.data.password) {
        return NextResponse.json(
          {
            message:
              "Current password is required to change email",
          },
          { status: 400 }
        );
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          password: true,
        },
      });

      if (!dbUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const validPassword = await bcrypt.compare(
        result.data.password,
        dbUser.password
      );

      if (!validPassword) {
        return NextResponse.json(
          { message: "Incorrect password" },
          { status: 401 }
        );
      }

      const existingEmail = await prisma.user.findFirst({
        where: {
          email: result.data.email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const updateData: {
      username?: string;
      email?: string;
    } = {};

    if (result.data.username) {
      updateData.username = result.data.username;
    }

    if (result.data.email) {
      updateData.email = result.data.email;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        email: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const result = deleteAccountSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      result.data.currentPassword,
      dbUser.password
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted",
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

