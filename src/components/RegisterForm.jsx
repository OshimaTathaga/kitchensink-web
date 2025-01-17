import {useState} from 'react';
import {TextField, Button, Box, Typography, Divider, Tooltip} from '@mui/material';

import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/AccountCircle";
import GitHubIcon from "@mui/icons-material/GitHub";
import {api} from "../api/api.js";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9][0-9]{9}$/;  // Exactly 10 digits for Indian numbers
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 chars, 1 letter, 1 number

const RegisterForm = ({ setAlertMessage }) => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(!EMAIL_REGEX.test(value)); // Validate email format
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameError(value.length < 5); // Validate name length
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        setPhoneError(!PHONE_REGEX.test(value)); // Validate phone number
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(!PASSWORD_REGEX.test(value)); // Validate password policy
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerMember = {email, name, phoneNumber, password};

        try {
            await api.post('/api/members', registerMember);
            
            setAlertMessage({children: 'Account created, please login...', severity: 'success'});
            
            resetInputFields();
        } catch (err) {
            console.log(err.response?.data?.message || "Registration failed. Try again.");
        }
    };

    const resetInputFields = () => {
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setName('');
    };

    const isRegisterDisabled =
      emailError || nameError || phoneError || passwordError || !email || !name || !phoneNumber || !password;

    return (
      <Box component="form" onSubmit={handleRegister} sx={{mt: 2}}>
          <Typography variant="h6">Register</Typography>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? 'Please enter a valid email address.' : ''}
          />

          {/* Name Field */}
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={handleNameChange}
            error={nameError}
            helperText={nameError ? 'Name must be at least 5 characters long.' : ''}
          />

          {/* Phone Number Field */}
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <TextField
                label="Country Code"
                value="+91"
                disabled
                variant="outlined"
                sx={{width: '100px', mt: 1}}
              />
              <Tooltip
                title="Exactly 10 digits without any spaces or special characters."
                arrow
                placement="right"
              >
                  <TextField
                    fullWidth
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
          <Tooltip
            title="Password must be at least 8 characters long and contain at least one letter and one number."
            arrow
            placement="right"
          >
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                helperText={passwordError ? 'Password does not meet the policy requirements.' : ''}
              />
          </Tooltip>

          {/* Register Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isRegisterDisabled}
          >
              Register
          </Button>

          <Divider sx={{my: 2, mx: 2, mb: 2}}/>

          <Button variant="outlined" fullWidth sx={{mb: 1}}>Register with OTP</Button>

          <Button variant="outlined" fullWidth startIcon={<GoogleIcon/>} sx={{mb: 1}}>Register with Google</Button>
          <Button variant="outlined" fullWidth startIcon={<MicrosoftIcon/>} sx={{mb: 1}}>Register with
              Microsoft</Button>
          <Button variant="outlined" fullWidth startIcon={<GitHubIcon/>} sx={{mb: 1}}>Register with GitHub</Button>
      </Box>
    );
};

export default RegisterForm;
