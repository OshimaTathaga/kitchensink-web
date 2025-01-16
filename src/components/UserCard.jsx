import { Delete, Edit, Save } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useState } from "react";
import EditableTextField from "./EditableTextField";
import AlertPopup from '../components/AlertPopup.jsx';

const cardStyle = {
  minWidth: "345px",
  boxShadow: "3px",
  borderRadius: "2px",
};

const cardHeaderStyle = {
  textAlign: "center", 
  display: "flex",
  justifyContent: "space-between"
};

const editableTextStyle = {
  height: "40px",
  padding: "8.5px"
}

const UserCard = ({ user, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [isOpen, setIsOpen] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const { name, email, phoneNumber, password = "" } = formData;
  const maskedPassword = "supersecretpassword".replace(/./g, "*");

  const toggleEdit = () => setIsEditing(!isEditing);

  const isError = passwordError || nameError || phoneError;

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, 1 letter, 1 number
  const phoneRegex = /^\d{10}$/; // Exactly 10 digits for Indian numbers

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordError(!passwordRegex.test(value)); // Validate password policy
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    setNameError(value.length < 5); // Validate name length
  };

  const handlePhoneChange = (e) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, phoneNumber: value }));
      setPhoneError(!phoneRegex.test(value)); // Validate phone number
  };

  const handleSave = () => {
    setIsEditing(false);
    setFormData((prev) => ({ ...prev, password: "" }));
    onSave(formData); // Save the updated data
  };

  const gridItemStyle = { display: "flex", flexDirection: "column", gap: "16px" };

  return (
    <>
      <Card sx={cardStyle} >
        <CardHeader
          sx={cardHeaderStyle}
          avatar={
            <Avatar sx={{width: "200px", height: "200px", marginLeft: "32px"}} alt={name} src="/public/avatar.jpg" />
          }
          action={
            <Box>
              <IconButton onClick={() => setIsOpen(true)} aria-label="delete" >
                <Delete />
              </IconButton>
              <IconButton onClick={isEditing ? handleSave : toggleEdit} aria-label="edit" disabled={isError}>
                {isEditing ? <Save /> : <Edit />}
              </IconButton>
            </Box>
          }
        />
  
        <CardContent>
          <Grid container spacing={"16px"}>
            <Grid item xs={6} sx={gridItemStyle}>
              <Typography variant="body1" fontWeight="bold" sx={editableTextStyle}>Name:</Typography>
              <Typography variant="body1" fontWeight="bold" sx={editableTextStyle}>Email:</Typography>
              <Typography variant="body1" fontWeight="bold" sx={editableTextStyle}>Phone:</Typography>
              <Typography variant="body1" fontWeight="bold" sx={editableTextStyle}>Password:</Typography>
            </Grid>
        
            <Grid item xs={6} sx={gridItemStyle}>
              <EditableTextField style={editableTextStyle} isEditing={isEditing} handleChange={handleNameChange} name="name" value={name} />
              <Typography variant="body1" sx={editableTextStyle}>{email}</Typography>
              <EditableTextField style={editableTextStyle} isEditing={isEditing} handleChange={handlePhoneChange} name="phoneNumber" value={phoneNumber} />
              <EditableTextField style={editableTextStyle} isEditing={isEditing} handleChange={handlePasswordChange} name="password" value={isEditing ? password : maskedPassword} error={passwordError} helperText={"Password does not \n meet the policy requirements."} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {isOpen && (
          <AlertPopup
            isOpen={isOpen}
            message={"Are you sure you want to delete your own profile?"}
            handleAgreeClick={onDelete}
            handleClose={() => setIsOpen(false)}
          />
      )}
    </>
  );
};

export default UserCard;
