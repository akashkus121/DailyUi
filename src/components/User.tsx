import React from "react";
import { useUser } from "../context/UserContext";

function UserProfile(){
    const  user  = useUser();

    return(
 <div>
        <h1>User Info</h1>
        <div>
      <h1>User Info</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Avatar: <img src={user.avatar} alt="Avatar" width={50} /></p>
    </div>
 </div>
    )
}

export default UserProfile;
    