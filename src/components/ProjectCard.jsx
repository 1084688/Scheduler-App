import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from './ConfirmDialog';

export default function ProjectCard({ project, onClick, onDelete }) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const formatDate = (date) => 
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const isPast = (date) => new Date(date) < new Date();
  
  const getProgressPercentage = () => {
    if (!project.subTasks || project.subTasks.length === 0) return 0;
    return Math.round((project.subTasks.filter(t => t.completed).length / project.subTasks.length) * 100);
  };
  
  const getPaidAmount = () => {
    if (!project.subTasks) return 0;
    return project.subTasks.filter(t => t.completed).reduce((sum, t) => sum + (t.payment || 0), 0);
  };
  
  const progress = getProgressPercentage();
  const isOverdue = isPast(project.deadline);

  const handleDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(project.id);
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <Card 
        onClick={onClick}
        sx={{ 
          cursor: 'pointer', 
          width: '100%',
          height: 350,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover .delete-button': {
            opacity: 1
          }
        }}
      >
        <IconButton
          className="delete-button"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'error.main',
            color: 'white',
            opacity: 0,
            transition: 'opacity 0.2s',
            zIndex: 10,
            '&:hover': {
              bgcolor: 'error.dark'
            }
          }}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          p: 3,
          height: '100%'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                flexGrow: 1, 
                pr: 1, 
                height: 56,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {project.name}
            </Typography>
            <Chip 
              label={isOverdue ? 'OVERDUE' : 'ACTIVE'}
              color={isOverdue ? 'error' : 'success'}
              size="small"
              sx={{ fontWeight: 700, flexShrink: 0 }}
            />
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              height: 40
            }}
          >
            {project.description || 'No description'}
          </Typography>
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ 
              borderTop: '2px solid', 
              borderColor: 'divider', 
              pt: 2, 
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                  Deadline
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatDate(project.deadline)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                  Budget
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getPaidAmount().toLocaleString()} / {(project.myProfit || 0).toLocaleString()} AED
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 2,
                  bgcolor: 'secondary.dark',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: isOverdue ? 'error.main' : 'primary.main'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {project.subTasks?.filter(t => t.completed).length || 0} / {project.subTasks?.length || 0} tasks
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${project.name}"? This action cannot be undone.`}
      />
    </>
  );
}
