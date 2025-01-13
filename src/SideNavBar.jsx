import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import React from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "./api/api.js";

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: "0 0.5rem",
  justifyContent: 'space-between',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const SideNavBar = ({role, onLogout}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  
   const handleLogout = () => {
      setAuthToken(null); // Clear token
      navigate("/"); // Redirect to login
      onLogout();
    };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const pages = role === "admin" ? ["Profile", "Admin View"] : ["Profile", "User View"];

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, display: open ? "none" : "auto" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Kitchen Sink
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader >
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pages.map((page) => (
            <ListItem key={page} disablePadding>
              <ListItemButton
                sx={{
                  "&:hover": {
                    color: "inherit", // Replace with your desired color
                  },
                }}
                component="a"
                onClick={() => {
                  handleDrawerClose();
                  navigate(`/${page.split(" ").at(0).toLowerCase()}`);
                }}>
                <ListItemText primary={page} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SideNavBar;