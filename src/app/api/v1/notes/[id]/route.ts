import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/currentUser";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
console.log("PATCH ID:", id);
console.log("USER ID:", userId);
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const updatedNote = await prisma.note.update({
      where: {
        id: note.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    await prisma.note.delete({
      where: {
        id: note.id,
      },
    });

    return NextResponse.json({
      message: "Note deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}