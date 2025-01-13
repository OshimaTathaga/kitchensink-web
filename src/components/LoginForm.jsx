import {useState} from 'react';
import {TextField, Button, Box, Typography, Divider, Tooltip} from '@mui/material';

import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MicrosoftIcon from '@mui/icons-material/AccountCircle';
import {api, setAuthToken} from "../api/api.js";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const LoginForm = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [error, setError] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, 1 letter, 1 number

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(!emailRegex.test(value)); // Validate email format
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(!passwordRegex.test(value)); // Validate password policy
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);
            const response = await axios.post("http://localhost:9000/login", formData);
            const {access_token: token} = response.data;
            setAuthToken(token);
            
            const decoded = jwtDecode(token);
            const role = decoded?.roles[0]?.toLowerCase();
            
            onLogin(role);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
        }
    };

    const isLoginDisabled = emailError || passwordError || !email || !password;

    return (
      <Box component="form" onSubmit={handleLogin} sx={{mt: 2}}>
          <Typography variant="h6">Login</Typography>
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
          <Button type="submit" variant="contained" color="primary" disabled={isLoginDisabled} fullWidth>Login</Button>

          {error && (
            <Typography color="error" sx={{mt: 1}}>
                {error}
            </Typography>
          )}

          <Button variant="text" fullWidth sx={{mt: 1}}>Forgot Password?</Button>

          <Divider sx={{my: 2, mx: 2, mb: 2}}/>

          <Button variant="outlined" fullWidth sx={{mb: 1}}>Login with OTP</Button>

          <Button variant="outlined" fullWidth startIcon={<GoogleIcon/>} sx={{mb: 1}}>Login with Google</Button>
          <Button variant="outlined" fullWidth startIcon={<MicrosoftIcon/>} sx={{mb: 1}}>Login with Microsoft</Button>
          <Button variant="outlined" fullWidth startIcon={<GitHubIcon/>} sx={{mb: 1}}>Login with GitHub</Button>
      </Box>
    );
};

export default LoginForm;
