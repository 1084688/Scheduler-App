import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProjectDetailsBottomNav({ 
  onBack, 
  onMarkComplete, 
  onDelete, 
  canMarkComplete 
}) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: 'background.paper',
        borderTop: '3px solid',
        borderColor: 'primary.main',
        borderRadius: 0,
        py: 3,
        px: 4
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: 'lg',
        mx: 'auto'
      }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          variant="outlined"
          size="large"
          sx={{ py: 1.5, px: 3 }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            size="large"
            sx={{ py: 1.5, px: 3 }}
          >
            Delete Project
          </Button>
          
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={onMarkComplete}
            disabled={!canMarkComplete}
            size="large"
            sx={{ py: 1.5, px: 4 }}
          >
            Mark as Complete
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
