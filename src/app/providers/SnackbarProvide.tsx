"use client";

import { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

type SnackbarContextType = {
  showSnackbar: (
    message: string,
    severity?: SnackbarSeverity
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<SnackbarSeverity>("success");
  const [open, setOpen] = useState(false);

  function showSnackbar(
    message: string,
    severity: SnackbarSeverity = "success"
  ) {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      "useSnackbar must be used inside SnackbarProvider"
    );
  }

  return context;
}