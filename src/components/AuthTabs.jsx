import {useState} from 'react';
import {Tabs, Tab, Box, Container, CssBaseline, ThemeProvider} from '@mui/material';
import {styled} from "@mui/system";

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import {lexendTheme} from "../themes/lexend.js";
import CustomAlert from "./CustomAlert.jsx";

const LoginContainer = styled(Container)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgb(245, 247, 250)',
}));

const Card = styled(Box)(({theme}) => ({
    padding: theme.spacing(4),
    borderRadius: '2rem',
    boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -1px rgba(0,0,0,0.03)',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    maxWidth: 550,
    width: '100%',
}));

export default function AuthTabs({ onLogin }) {
    const [value, setValue] = useState(0);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleCloseCustomAlert = () => setAlertMessage(null);
    const handleChange = (event, newValue) => setValue(newValue);

    return (
      <ThemeProvider theme={lexendTheme}>
          <CssBaseline/>
          <LoginContainer>
              <Card>
                  <Tabs value={value} onChange={handleChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
                      <Tab label="Login"/>
                      <Tab label="Register"/>
                  </Tabs>
                  {value === 0 && <LoginForm {...{onLogin, setAlertMessage}} />}
                  {value === 1 && <RegisterForm {...{setAlertMessage}} />}
              </Card>
          </LoginContainer>
          <CustomAlert alertMessage={alertMessage} handleCloseCustomAlert={handleCloseCustomAlert} />
      </ThemeProvider>
    );
}
