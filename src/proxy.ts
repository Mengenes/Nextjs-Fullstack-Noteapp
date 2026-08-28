
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await getAuthUser(token);

    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
export const config = {
  matcher: [
    "/api/v1/profile/:path*",
    "/api/v1/notes/:path*",
  ],
};