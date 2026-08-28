import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers/QueryProvider";
import { SnackbarProvider } from "./providers/SnackbarProvide";



export const metadata: Metadata = {
  title:{default: " NoteFlow Next.js App",
  template:"%s | NoteFlow App "
  },
  description: "Simple note taking application ",
};
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={roboto.className}
    >
      <body className="min-h-dvh flex flex-col w-full">
        <Providers>
          <SnackbarProvider>
        <Navbar />
       <main className="flex flex-1 flex-col">
        {children}
        </main>
        </SnackbarProvider>
        </Providers>
        </body>
    </html>
  );
}
