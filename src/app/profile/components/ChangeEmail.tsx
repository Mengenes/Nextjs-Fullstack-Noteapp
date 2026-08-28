"use client"


import  DialogContent  from "@mui/material/DialogContent";
import  DialogTitle  from "@mui/material/DialogTitle";
import  Button  from "@mui/material/Button";
import  Dialog  from "@mui/material/Dialog";
import  Input  from "@mui/material/Input";
import  DialogActions  from "@mui/material/DialogActions";
import {  useState } from "react";

import Card from "@mui/material/Card"

import {z} from "zod"
import { useSnackbar } from "@/app/providers/SnackbarProvide";
import { apiFetch } from "@/lib/apiFetch";
const profileSchema = z.object({
password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  email:z.email("Invalid Email")
});

export default function  ChangeEmail(){
    const [dialogOpen,setDialogOpen]=useState<boolean>(false)
    const [password,setPassword]=useState<string>("")
    const [email,setEmail]=useState<string>("")
    const {showSnackbar}=useSnackbar();

    
 async function updateEmail(event:React.SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

      const result = profileSchema.safeParse({
      password,email});

 if (!result.success) {
  showSnackbar(result.error.issues[0].message, "error");
  return;
}



  try {
    const res = await apiFetch("/api/v1/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    });



    if (!res.ok) {
      throw new Error("Failed to update profile");
    }
 await res.json();
     
 setDialogOpen(false);
      setEmail("");
      setPassword("");
      showSnackbar("Email updated successfully","success");
  } catch (error) {
    console.error("Error updating profile:", error);
    showSnackbar("Failed to update email","error")
  }
}



return(
<Card>
<Button onClick={()=>setDialogOpen(true)}>Change Email</Button>
<Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
 <DialogTitle>Change Email</DialogTitle>
<DialogContent>
<form id="profile-form" onSubmit={updateEmail}>
  
    <p>
             Enter your password and your new email
            </p>
            
<div className="flex flex-col mt-5">
  <label htmlFor="email">Email</label>
<Input  type="email" value={email} onChange={(event)=>setEmail(event.target.value)}></Input>
</div>
<div  className="flex flex-col mt-5">
    <label htmlFor="password">Confirm Password</label>
<Input type="password" value={password} onChange={(event)=>setPassword(event.target.value)}></Input>
</div>

</form>
    
    
    </DialogContent>   
<DialogActions>
 <Button onClick={()=>setDialogOpen(false)}>Cancel</Button>
  <Button  type="submit"  form="profile-form">Save</Button>      
</DialogActions>

</Dialog>



</Card>


)


}