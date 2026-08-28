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
  username: z.string().min(6, "Username must be at least 6 characters"),

});

export default function  ChangeUsername(){
    const [dialogOpen,setDialogOpen]=useState<boolean>(false)
    const [username,setUsername]=useState<string>("")
    const {showSnackbar}=useSnackbar();

    
 async function updateUsername(event:React.SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

      const result = profileSchema.safeParse({
      username});

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
      setUsername("");
      showSnackbar("Username updated successfully","success");
  } catch (error) {
    console.error("Error updating profile:", error);
    showSnackbar("Failed to update username","error")
  }
}



return(
<Card>
<Button onClick={()=>setDialogOpen(true)}>Change Username</Button>
<Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
 <DialogTitle>Change Username</DialogTitle>
<DialogContent >
<form id="profile-form" onSubmit={updateUsername}>
  <p className="font-light">
              Enter your new username to change
            </p> 
 <div className="flex flex-col mt-5">          
<label>Username</label>
<Input value={username} onChange={(event)=>setUsername(event.target.value)}></Input>
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