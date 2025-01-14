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

const gridItemStyle = { display: "flex", flexDirection: "column", gap: "16px" };

const editableTextStyle = {
  height: "40px",
  padding: "8.5px"
}

const UserCard = ({ user, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const { name, email, phoneNumber, password } = formData;
  const maskedPassword = "supersecretpassword".replace(/./g, "*");

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(formData); // Save the updated data
  };

  return (
    <Card sx={cardStyle} >
      <CardHeader
        sx={cardHeaderStyle}
        avatar={
          <Avatar sx={{width: "200px", height: "200px", marginLeft: "32px"}} alt={name} src="/public/avatar.jpg" />
        }
        action={
          <Box>
            <IconButton onClick={onDelete} aria-label="delete" color="error">
              <Delete />
            </IconButton>
            <IconButton onClick={isEditing ? handleSave : toggleEdit} aria-label="edit">
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
            <EditableTextField style={editableTextStyle} isEditing={isEditing} handleChange={handleChange} name="name" value={name} />
            <Typography variant="body1" sx={editableTextStyle}>{email}</Typography>
            <EditableTextField style={editableTextStyle} isEditing={isEditing} handleChange={handleChange} name="phoneNumber" value={phoneNumber} />
            <EditableTextField style={editableTextStyle} isEditing={isEditing} handleChange={handleChange} name="password" value={isEditing ? password : maskedPassword} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCard;
