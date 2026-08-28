import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/currentUser";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string(),
});



export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {

  const userId = await getCurrentUserId();


  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const result = noteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid note data" },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      title: result.data.title,
      content: result.data.content,
      userId,
    },
  });

  return NextResponse.json(note, { status: 201 });
}