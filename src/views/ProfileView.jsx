import UserCard from "../components/UserCard";
import {setAuthToken} from "../api/api.js";
import { deleteUser, getUser, updateUser } from "../api/userService.js";
import { useEffect, useState } from "react";

const ProfileView = ({handleLogout, email}) => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser(email);
      setUser(userData);
    };

    fetchUserData(); 
  }, [])

  const handleDelete = async () => {
    await deleteUser(email)
    setAuthToken(null);
    handleLogout();
  }

  const handleSave = async (data) => {
    console.log(data)
    const updatedUser = await updateUser(email, data);
    setUser(updatedUser);
  }

  return user && <UserCard user={user} onSave={handleSave} onDelete={handleDelete} />
};

export default ProfileView;