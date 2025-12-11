import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function ProjectHeader({ project, isPast, handleOpenNotes }) {
  return (
    <Card sx={{ mb: 4, bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>{project.name}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {project.projectMode && (
              <Chip label={project.projectMode === 'awarded' ? 'AWARDED' : 'STUDY'} color={project.projectMode === 'awarded' ? 'success' : 'warning'} sx={{ fontWeight: 700 }} />
            )}
            <Chip 
              label={project.status === 'completed' ? 'COMPLETED' : isPast(project.deadline) ? 'OVERDUE' : 'ACTIVE'}
              color={project.status === 'completed' ? 'info' : isPast(project.deadline) ? 'error' : 'success'}
              sx={{ fontWeight: 700 }} 
            />
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, color: '#94a3b8' }}>{project.description || 'No description'}</Typography>

        {project.notes ? (
          <Box sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>NOTES</Typography>
              <IconButton size="small" onClick={handleOpenNotes} sx={{ color: '#94a3b8' }}><EditIcon fontSize="small" /></IconButton>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'white' }}>{project.notes}</Typography>
          </Box>
        ) : (
          <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={handleOpenNotes} sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.2)' }}>Add Notes</Button>
        )}
      </CardContent>
    </Card>
  );
}
