import LoginForm from "./LoginForm";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { redirect } from "next/navigation";
import { Metadata } from "next";

  export const  metadata:Metadata={
title:"Login ",

  }

export default async  function Login() {
  if (await isAuthenticated()) {
  redirect("/");
}
  return (
    <div className="flex flex-1 items-center justify-center">

     <LoginForm/>
    </div>
  );
}