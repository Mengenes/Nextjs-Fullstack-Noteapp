"use client";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Input from "@mui/material/Input";
import DialogActions from "@mui/material/DialogActions";


import { useState } from "react";
import { z } from "zod";

import { useSnackbar } from "@/app/providers/SnackbarProvide";
import { apiFetch } from "@/lib/apiFetch";

const deleteAccountSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Password is required"),
});

export default function DeleteAccount() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const { showSnackbar } = useSnackbar();

  async function deleteAccount(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const result = deleteAccountSchema.safeParse({
      currentPassword: password,
    });

    if (!result.success) {
      showSnackbar(result.error.issues[0].message, "error");
      return;
    }

    try {
      const res = await apiFetch("api/v1/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      await res.json();

      setDialogOpen(false);
      setPassword("");

      showSnackbar(
        "Account deleted successfully",
        "success"
      );

   
    } catch (error) {
      console.error("Error deleting account:", error);

      showSnackbar(
        "Failed to delete account",
        "error"
      );
    }
  }

  return (
    <div>
      <Button
        color="error"
        onClick={() => setDialogOpen(true)}
      >
        Delete Account
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>

        <DialogContent>
          <form
            id="delete-account-form"
            onSubmit={deleteAccount}
          >
            <p className="font-light">
              This action cannot be undone. Enter your
              password to confirm.
            </p>
<div className="flex flex-col mt-5">
            <label htmlFor="password">
              Password
            </label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
             
            />
            </div>
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="delete-account-form"
            color="error"
            
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}