"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import z from "zod";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const noteSchema = z.object({
  title: z.string().min(4).max(20),
  content: z.string().min(5).max(200),
});

type NoteSchemaType = z.infer<typeof noteSchema>;

export default function NotesDropwdown({ note }: { note: Note }) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  const updateNote = useMutation({
    mutationFn: async (data: NoteSchemaType) => {
      const res = await apiFetch(`/api/v1/notes/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);

        throw new Error(
          body?.message || "Failed to update note"
        );
      }

      return res.json();
    },

    onSuccess: () => {
      setEditing(false);
      router.refresh();
    },
  });

  const deleteNote = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/v1/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);

        throw new Error(
          body?.message || "Failed to delete note"
        );
      }

      return res.json();
    },

    onSuccess: () => {
      setDeleteDialogOpen(false);
      router.refresh();
    },
  });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();

    reset({
      title: note.title,
      content: note.content,
    });

    setEditing(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteNote.mutate();
  };

  const handleCancelEdit = () => {
    reset({
      title: note.title,
      content: note.content,
    });

    setEditing(false);
  };

  const onSubmit = (data: NoteSchemaType) => {
    updateNote.mutate(data);
  };

  return (
    <>
      <div className="group flex min-h-30 flex-col rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-[#FEF3C7]">
        {editing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TextField
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />

            <TextField
              label="Content"
              multiline
              rows={5}
              {...register("content")}
              error={!!errors.content}
              helperText={errors.content?.message}
              fullWidth
            />

            <div className="flex gap-2">
              <Button
                type="submit"
                variant="contained"
                disabled={updateNote.isPending}
              >
                {updateNote.isPending ? "Saving..." : "Save"}
              </Button>

              <Button
                type="button"
                onClick={handleCancelEdit}
                disabled={updateNote.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="wrap-break-word text-xl font-semibold text-gray-900">
                {note.title}
              </h2>

              <p className="mt-3 line-clamp-6 wrap-break-word text-sm leading-6 text-gray-600">
                {note.content}
              </p>
            </div>

            <div>
              <IconButton
                onClick={handleMenuOpen}
                aria-label="note options"
              >
                ⋮
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>
                  Edit Note
                </MenuItem>

                <MenuItem onClick={handleDeleteClick}>
                  Delete Note
                </MenuItem>
              </Menu>
            </div>
          </div>
        )}

        <div className="mt-auto pt-5 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Created {note.createdAt.toLocaleDateString()}
          </span>

          <span className="text-xs text-gray-400">
            Updated {note.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleteNote.isPending) {
            setDeleteDialogOpen(false);
          }
        }}
      >
        <DialogTitle>Delete note?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <span className="font-bold">{note.title}</span>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            disabled={deleteNote.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteNote.isPending}
          >
            {deleteNote.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}