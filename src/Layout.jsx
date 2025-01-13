import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider,
  Box
} from "@mui/material";
import { setAuthToken } from "./api/api.js";

const drawerWidth = 240;

const drawerStyle = {
  width: drawerWidth,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
  }
}

const mainStyle = {
  height: "100vh",
  padding: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: `${drawerWidth}px`,
}

const Layout = ({ children, auth, onLogout }) => {
  if (!auth.isAuthenticated) return children;

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null); // Clear token
    onLogout();
    navigate("/"); // Redirect to login
  };

  const pages = auth.role === "admin" ? ["Profile", "Admin View"] : ["Profile", "User View"];

  return (
    <Box >
      <AppBar position="fixed" >
        <Toolbar>
          <Typography variant="h6" noWrap paddingLeft={`${drawerWidth}px`}>
            Kitchen Sink
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={drawerStyle}
        variant="permanent"
        anchor="left"
      >
        <Box padding="0.8rem">
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Divider />
        <List>
          {pages.map((page) => (
            <ListItem key={page} disablePadding>
              <ListItemButton onClick={() => navigate(`/${page.split(" ")[0].toLowerCase()}`)}>
                <ListItemText primary={page} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={mainStyle}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;