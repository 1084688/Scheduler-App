import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

export default function ValidationPopup({ open, message, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert 
        onClose={onClose} 
        severity="error" 
        variant="filled"
        sx={{ 
          width: '100%',
          minWidth: 400,
          bgcolor: '#dc2626',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
          '& .MuiAlert-icon': {
            fontSize: 28
          }
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Validation Error
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
}
