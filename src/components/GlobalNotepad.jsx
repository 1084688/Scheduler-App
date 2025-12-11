import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Fab } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import CloseIcon from '@mui/icons-material/Close';

export default function GlobalNotepad({ onToggle, hasBottomNav }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(localStorage.getItem('globalNotes') || '');
  const notepadRef = useRef(null);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem('globalNotes', newNotes);
  };

  const handleToggle = (open) => {
    setIsOpen(open);
    if (onToggle) {
      onToggle(open);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notepadRef.current && !notepadRef.current.contains(event.target) && isOpen) {
        const fabButton = document.querySelector('[data-notepad-fab]');
        if (!fabButton || !fabButton.contains(event.target)) {
          handleToggle(false);
        }
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <>
      <Fab
        data-notepad-fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: hasBottomNav ? 120 : 24,
          right: 24,
          zIndex: 1200,
          display: isOpen ? 'none' : 'flex',
          transition: 'bottom 0.3s ease-in-out'
        }}
        onClick={() => handleToggle(true)}
      >
        <NotesIcon />
      </Fab>

      {isOpen && (
        <Paper
          ref={notepadRef}
          elevation={24}
          sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: 350,
            zIndex: 1300,
            bgcolor: '#0f172a',
            borderLeft: '3px solid #22d3ee',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '2px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(15, 23, 42, 0.8)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotesIcon sx={{ color: '#22d3ee' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Quick Notes</Typography>
            </Box>
            <IconButton onClick={() => handleToggle(false)} size="small" sx={{ color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* TEXT AREA - FIXED */}
          <Box sx={{ flexGrow: 1, p: 2, display: 'flex' }}>
            <TextField
              fullWidth
              multiline
              value={notes}
              onChange={handleNotesChange}
              placeholder="Write your notes here...&#10;&#10;• Task reminders&#10;• Ideas&#10;• Important dates&#10;• Anything you need to remember"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': { 
                  bgcolor: 'rgba(30, 41, 59, 0.5)', 
                  color: 'white',
                  height: '100%',
                  alignItems: 'flex-start',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  padding: 0
                },
                '& .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px' // Normal border radius, not pill-shaped
                },
                '& .MuiInputBase-input': { 
                  color: 'white',
                  padding: '12px'
                },
                '& .MuiInputBase-input::placeholder': { 
                  color: '#64748b', 
                  opacity: 1 
                }
              }}
            />
          </Box>

          {/* FOOTER */}
          <Box sx={{ 
            p: 2, 
            borderTop: '2px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(15, 23, 42, 0.8)'
          }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Auto-saved • Click outside or press ESC to close
            </Typography>
          </Box>
        </Paper>
      )}
    </>
  );
}
