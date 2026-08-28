import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/isAuthenticated";
import NotesData from "./notes/NotesData";
import NotesLoading from "./notes/NotesLoading";

export default async function Notes() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  return (
  <div className="flex  min-h-full  flex-col  gap-5 p-10   ">
  

    <Suspense fallback={<NotesLoading/>}>
    
      <NotesData />
      
    </Suspense>
  </div>
);
}