// src/pages/CompletedProjects.jsx
import React, { useMemo } from 'react';
import { Container, Box, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { Timeline } from '../components/ui/timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import ProjectForm from '../components/ProjectForm';

export default function CompletedProjects({ projects, onRestore, onDelete }) {
  
  // Transform projects into Timeline Data Format
  const timelineData = useMemo(() => {
    // 1. Sort projects by completion date (newest first)
    const sorted = [...projects].sort((a, b) => 
      new Date(b.completedDate || b.deadline) - new Date(a.completedDate || a.deadline)
    );

    // 2. Group by Year
    const grouped = sorted.reduce((acc, project) => {
      const year = dayjs(project.completedDate || project.deadline).format('YYYY');
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    }, {});

    // 3. Map to Timeline Entry structure
    return Object.keys(grouped).sort((a, b) => b - a).map(year => ({
      title: year,
      content: (
        <div className="flex flex-col gap-6">
          {grouped[year].map(project => (
            <Card 
              key={project.id} 
              sx={{ 
                bgcolor: 'rgba(15, 23, 42, 0.6)', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                    {project.name}
                  </Typography>
                  <Chip 
                    icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} 
                    label="DONE" 
                    color="success" 
                    size="small" 
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                   {project.description || "No description provided."}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                   <Box>
                     <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                       Finished
                     </Typography>
                     <Typography variant="body2" sx={{ color: 'white' }}>
                       {dayjs(project.completedDate).format('MMM D, YYYY')}
                     </Typography>
                   </Box>
                   <Box sx={{ textAlign: 'right' }}>
                     <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                       Net Profit
                     </Typography>
                     <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                       {(project.myProfit || 0).toLocaleString()} AED
                     </Typography>
                   </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                   <Button 
                     size="small" 
                     startIcon={<ReplayIcon />} 
                     onClick={() => onRestore(project.id)}
                     sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}
                   >
                     Restore
                   </Button>
                   <Button 
                     size="small" 
                     startIcon={<DeleteIcon />} 
                     onClick={() => onDelete(project.id)}
                     color="error"
                   >
                     Delete
                   </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }));
  }, [projects, onRestore, onDelete]);

  if (projects.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>No Completed Projects</Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Projects you mark as "Complete" will appear here in your timeline.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Timeline data={timelineData} />
    </Box>
  );
}
