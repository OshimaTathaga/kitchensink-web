import { Snackbar, Alert } from "@mui/material";

export default function CustomAlert({ alertMessage, handleCloseCustomAlert }) {
  return <>
    {!!alertMessage && (
      <Snackbar
        open
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleCloseCustomAlert}
        autoHideDuration={3000}
      >
        <Alert {...alertMessage} onClose={handleCloseCustomAlert} />
      </Snackbar>
    )}
  </>
};
