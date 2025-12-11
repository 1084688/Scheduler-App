import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box 
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'divider'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 32 }} />
          <Typography variant="h3">{title}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          fullWidth
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          fullWidth
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
