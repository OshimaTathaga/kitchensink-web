import { Delete, Edit, Save } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Tooltip, TextField,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useState } from "react";
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

  const gridItemStyle = { display: "flex", flexDirection: "column" };

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
          <Grid container>
            <Grid item xs={12} sx={gridItemStyle}>
              
              {/* Name Field */}
              <TextField
                fullWidth
                disabled={!isEditing}
                label="Name"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={handleNameChange}
                error={nameError}
                helperText={nameError ? 'Name must be at least 5 characters long.' : ''} />
              
              {/* Email Field */}
              <TextField fullWidth disabled label="Email" variant="outlined" margin="normal" value={email} />
              
              {/* Phone Number Field */}
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <TextField label="Country Code" value="+91" disabled variant="outlined" sx={{width: '100px', mt: 1}} />
                <Tooltip disableHoverListener={!isEditing} title="Exactly 10 digits without any spaces or special characters." arrow placement="right">
                  <TextField
                    fullWidth
                    disabled={!isEditing}
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    error={phoneError}
                    helperText={phoneError ? 'Phone number must be exactly 10 digits.' : ''}
                  />
                </Tooltip>
              </Box>
              
              {/* Password Field with Tooltip */}
              <Tooltip disableHoverListener={!isEditing} title="Password must be at least 8 characters long and contain at least one letter and one number." arrow placement="right">
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  disabled={!isEditing}
                  value={isEditing ? password : maskedPassword}
                  onChange={handlePasswordChange}
                  error={passwordError}
                  helperText={passwordError ? 'Password does not meet the policy requirements.' : ''} />
              </Tooltip>
              
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
