import {Typography} from "@mui/material";

const UserView = () => {
  return <>
    <Typography variant="h1" sx={{ml: 50}}>Welcome user!</Typography>
    <Typography variant="h4" sx={{ml: 50}}>This page is only accessible to normal user.</Typography>
  </>;
};

export default UserView;