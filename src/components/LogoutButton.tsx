"use client";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      const res = await apiFetch("/api/v1/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <Button onClick={logout} >
      Logout
    </Button>
  );
}