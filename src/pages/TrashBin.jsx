import React, { useState } from 'react';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Chip, IconButton
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmDialog from '../components/ConfirmDialog';

export default function TrashBin({ projects, onRestore, onPermanentDelete, setCurrentPage }) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const formatDate = (date) => 
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getTotalPaid = (project) => {
    if (!project.subTasks) return 0;
    return project.subTasks.reduce((sum, task) => sum + (task.payment || 0), 0);
  };

  const handleRestoreClick = (projectId) => {
    onRestore(projectId);
  };

  const handlePermanentDeleteClick = (project) => {
    setProjectToDelete(project);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    onPermanentDelete(projectToDelete.id);
    setConfirmDeleteOpen(false);
    setProjectToDelete(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h1">Trash Bin</Typography>
      </Box>

      {projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 15 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Trash is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Deleted projects will appear here
            </Typography>
            <Button
              variant="contained"
              startIcon={<DashboardIcon />}
              onClick={() => setCurrentPage('dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          {projects.map(project => (
            <Card 
              key={project.id}
              sx={{ 
                width: '100%',
                height: 350,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                opacity: 0.8
              }}
            >
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
                    label="DELETED"
                    color="error"
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
                        Deleted On
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(project.deletedDate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                        Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.completedDate ? 'Completed' : 'Active'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                        Profit
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {getTotalPaid(project).toLocaleString()} AED
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<RestoreIcon />}
                      onClick={() => handleRestoreClick(project.id)}
                      size="small"
                    >
                      Restore
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handlePermanentDeleteClick(project)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'error.main',
                        borderRadius: 1
                      }}
                      size="small"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Project?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.name}"? This action CANNOT be undone and all project data will be lost forever.`}
      />
    </Container>
  );
}
