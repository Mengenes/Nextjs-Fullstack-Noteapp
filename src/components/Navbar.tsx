import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";
import LogoutButton from "./LogoutButton";
import { Avatar } from "@mui/material";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="flex items-center justify-between bg-[#FEF5C7] p-4  text-black ">
      <div className="flex space-x-4">
        <Link href="/">Home</Link>
        </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span>{user.username}</span>
            
            <Avatar  src={user.avatarUrl ?? undefined}alt={user.username}>
            </Avatar>
            <Link href="/profile">Profile</Link>
            
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}