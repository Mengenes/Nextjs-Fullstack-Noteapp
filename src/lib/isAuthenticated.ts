import { getAuthUser } from "./auth";
import { cookies } from "next/headers";


export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    return false;
  }

  try {
    await getAuthUser(token);
    return true;
  } catch {
    return false;
  }
}