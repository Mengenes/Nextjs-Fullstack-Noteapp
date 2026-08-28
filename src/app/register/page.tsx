import RegisterForm from "./RegisterForm";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { redirect } from "next/navigation";
import { Metadata } from "next";
  export const  metadata:Metadata={
title:"Register ",

  }
export default  async function Register() {



if (await isAuthenticated()) {
  redirect("/");
}

  return (
    <div className="flex flex-1 items-center justify-center   ">
  <RegisterForm/>
    </div>
  );
}