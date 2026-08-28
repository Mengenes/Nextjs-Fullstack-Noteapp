import { getCurrentUserId } from "@/lib/currentUser";
import { supabase } from "@/lib/supabase";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "No avatar provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("avatars")
      .upload(`${userId}/avatar`, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${userId}/avatar`);

    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
      },
    });

    return NextResponse.json({
      message: "Avatar uploaded",
      avatarUrl,
    });
  } catch (error) {
    console.error("AVATAR ROUTE ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}