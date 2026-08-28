import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function getCurrentUser() {
  const token = (await cookies()).get("accessToken")?.value;



  if (!token) {
    return null;
  }

  try {
    const { id } = await getAuthUser(token);



    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
      },
    });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) return null;

  try {
    const { id } = await getAuthUser(token);
    return id;
  } catch {
    return null;
  }
}
