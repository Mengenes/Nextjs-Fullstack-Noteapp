import ProfileData from "./components/ProfileData";
import { Suspense } from "react";
import ProfileSkeleton from "@/app/profile/components/ProfileSkeleton";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { getCurrentUser } from "@/lib/currentUser";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();

  return {
    title: user ? `${user.username} | Profile` : "Profile Page",
    description: user
      ? `${user.username}'s profile page`
      : "Profile Page",
  };
}

export default async function Profile() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center w-full p-5">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}