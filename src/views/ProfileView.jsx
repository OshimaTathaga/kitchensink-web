import UserCard from "../components/UserCard";
import {setAuthToken} from "../api/api.js";
import { deleteUser, getUser, updateUser } from "../api/userService.js";
import { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert.jsx";

const ProfileView = ({handleLogout, email}) => {
  const [user, setUser] = useState();

  const [alertMessage, setAlertMessage] = useState(null);
  const handleCloseCustomAlert = () => setAlertMessage(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser(email);
      setUser(userData);
    };

    fetchUserData(); 
  }, [email])

  const handleDelete = async () => {
    await deleteUser(email)
    setAuthToken(null);
    handleLogout();
  }

  const handleSave = async (user) => {
    const updatedUser = await updateUser(user.email, user);
    setUser(updatedUser);
    setAlertMessage({children: 'Profile updated...', severity: 'success'});
  }

  return user && <>
   <UserCard user={user} onSave={handleSave} onDelete={handleDelete} />
   <CustomAlert alertMessage={alertMessage} handleCloseCustomAlert={handleCloseCustomAlert} />
  </>
};

export default ProfileView;