import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/currentUser";
import NotesClient from "./NotesClient"

export default async function NotesData() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return <NotesClient notes={notes} />;
}