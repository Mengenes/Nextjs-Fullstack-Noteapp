import { jwtVerify } from "jose";

type AuthUser = {
  id: string;
};



export async function getAuthUser(token: string): Promise<AuthUser> {
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}


  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(JWT_ACCESS_SECRET)
  );

  if (typeof payload.id !== "string") {
    throw new Error("Invalid token payload");
  }

  return {
    id: payload.id,
  };
}