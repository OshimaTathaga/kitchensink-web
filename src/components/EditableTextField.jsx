import {TextField, Typography } from "@mui/material"

const EditableTextField = ({ isEditing = false, handleChange, name, value, style }) => {
  return isEditing ? 
    <TextField
      name={name}
      value={value}
      onChange={handleChange}
      variant="outlined"
      size="small"
    />
   : 
   <Typography variant="body1" sx={style}>{value}</Typography>
};

export default EditableTextField;