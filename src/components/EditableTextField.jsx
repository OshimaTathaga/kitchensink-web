import {TextField, Typography } from "@mui/material"

const EditableTextField = ({ isEditing = false, handleChange, name, value, style, error, helperText }) => {
  return isEditing ? 
    <TextField
      name={name}
      value={value}
      onChange={handleChange}
      variant="outlined"
      size="small"
      error={error}
      helperText={error &&  <div style={{ width: '170px' }}>{helperText}</div>}
    />
   : 
   <Typography variant="body1" sx={style}>{value}</Typography>
};

export default EditableTextField;