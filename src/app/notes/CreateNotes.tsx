"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";

const noteSchema = z.object({
  title: z.string().min(4, "Title is required").max(30),
  content: z.string().min(4, "Content is required").max(200),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function CreateNote() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createNote = useMutation({
    mutationFn: async (data: NoteFormData) => {
      const res = await apiFetch("/api/v1/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);

        throw new Error(
          body?.message || "Failed to create note"
        );
      }

      return res.json();
    },

    onSuccess: () => {
      reset();
      setOpen(false);
      router.refresh();
    },
  });

  const onSubmit = (data: NoteFormData) => {
    createNote.mutate(data);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      
      >
    Create Note
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          if (!createNote.isPending) {
            setOpen(false);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Note</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="flex flex-col gap-4">
            <TextField
              {...register("title")}
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={createNote.isPending}
            />

            <TextField
              {...register("content")}
              label="Content"
              fullWidth
              multiline
              minRows={5}
              error={!!errors.content}
              helperText={errors.content?.message}
              disabled={createNote.isPending}
            />

            {createNote.isError && (
              <p className="text-red-500">
                {createNote.error.message}
              </p>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              disabled={createNote.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={createNote.isPending}
            >
              {createNote.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}