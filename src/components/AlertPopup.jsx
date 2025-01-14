import {forwardRef} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertPopup = ({isOpen, message, handleAgreeClick, handleClose}) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-popup"
      fullWidth
    >
      <DialogContent>
        <DialogContentText id="alert-popup">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button
          onClick={() => {
            handleAgreeClick();
            handleClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertPopup;

