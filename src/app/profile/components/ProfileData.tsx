import { getCurrentUser } from "@/lib/currentUser";
import ChangeEmail from "./ChangeEmail";
import ChangeUsername from "./ChangeUsername";
import DeleteAccount from "./DeleteAccount";
import Card from "@mui/material/Card";
import AvatarUpload from "./AvatarUpload";

export default async function ProfileData() {
  const profileData = await getCurrentUser();

  if (!profileData) {
    return <p>Failed to load profile.</p>;
  }

  return (
    <Card className="w-full max-w-2xl rounded-2xl p-6 shadow-lg">
      <div className=" pb-5">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and profile picture.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 py-8">
        <AvatarUpload initialAvatarUrl={profileData.avatarUrl} />
        <p className="text-sm text-gray-500">
          JPG, PNG or WebP
        </p>
      </div>

      <div className=" pt-6">
        <h2 className="mb-4 text-lg font-semibold">
          Account information
        </h2>

        <div className="flex items-center justify-between  py-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">{profileData.username}</p>
          </div>

          <ChangeUsername />
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{profileData.email}</p>
          </div>

          <ChangeEmail />
        </div>
      </div>

      <div className="mt-6  pt-6">
        <h2 className="mb-2 text-lg font-semibold">Danger zone</h2>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Permanently delete your account and all associated data.
          </p>

          <DeleteAccount />
        </div>
      </div>
    </Card>
  );
}