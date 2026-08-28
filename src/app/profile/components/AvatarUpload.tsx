"use client";

import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
type AvatarUploadProps = {
  initialAvatarUrl: string | null;
};
export default function AvatarUpload({initialAvatarUrl,}:AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
const router = useRouter();
  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);

      const response = await fetch("api/v1/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();



      if (!response.ok) {
        throw new Error(text || "Upload failed");
      }

      const data = JSON.parse(text);

      setAvatarUrl(data.avatarUrl);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Avatar
        src={avatarUrl ?? undefined}
        sx={{
          width: 120,
          height: 120,
        }}
      />

      <Button
        variant="contained"
        component="label"
        disabled={uploading}
      >
        {uploading ? (
          <CircularProgress size={20} />
        ) : (
          "Upload avatar"
        )}

        <input
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
        />
      </Button>
    </Box>
  );
}