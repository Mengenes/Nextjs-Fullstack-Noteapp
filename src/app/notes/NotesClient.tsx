"use client";

import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import CreateNote from "./CreateNotes";
import NotesDropdown from "./NotesDropdown";
import { useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function NotesClient({ notes }: { notes: Note[] }) {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  const notesPerPage = 6;

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredNotes.length / notesPerPage
  );

  const startIndex = (page - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;

  const paginatedNotes = filteredNotes.slice(
    startIndex,
    endIndex
  );

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(e.target.value);
    setPage(1);
  };

  return (
    <div className="w-full max-w-8xl flex flex-col mx-auto">
      <div className="mb-8 mt-2">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            My Notes
          </h1>

          <CreateNote />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Capture your thoughts and keep your ideas organized.
        </p>
      </div>

      <div className="mb-8">
        <Input
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search notes..."
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {paginatedNotes.map((note) => (
          <NotesDropdown
            key={note.id}
            note={note}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span>
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outlined"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}