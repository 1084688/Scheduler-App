import React, { useState } from 'react';
import { 
  Container, Typography, Box, Button, Select, MenuItem, 
  FormControl, Card, CardContent, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderIcon from '@mui/icons-material/Folder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ProjectCard from '../components/ProjectCard';

// IMPORTANT: Added setSelectedProject to props
export default function Dashboard({ 
  projects = [], 
  setCurrentPage, 
  setSelectedProject, 
  onDeleteProject, 
  allProjects = [] 
}) {
  const [filter, setFilter] = useState('all');
  
  const isPast = (date) => new Date(date) < new Date();
  const differenceInDays = (date1, date2) => 
    Math.ceil((new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24));
  
  const reminders = [];
  (projects || []).forEach(project => {
    const daysUntilDeadline = differenceInDays(new Date(project.deadline), new Date());
    if (daysUntilDeadline <= 7 && daysUntilDeadline >= 0) {
      reminders.push({
        name: project.name,
        daysLeft: daysUntilDeadline,
        projectId: project.id
      });
    }
  });
  
  const filteredProjects = (projects || []).filter(project => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return isPast(project.deadline);
    if (filter === 'upcoming') {
      const days = differenceInDays(new Date(project.deadline), new Date());
      return days >= 0 && days <= 7;
    }
    return true;
  });
  
  const handleProjectClick = (project) => {
    if (setSelectedProject) {
      setSelectedProject(project);
      setCurrentPage('details');
    } else {
      console.error("setSelectedProject prop is missing!");
    }
  };

  // Stats Calculations
  const getTotalProfit = (projectList) => {
    return (projectList || []).reduce((total, project) => {
      if (!project.subTasks) return total;
      const projectProfit = project.subTasks
        .filter(task => task.completed)
        .reduce((sum, task) => sum + (task.payment || 0) - (task.expenses || 0), 0);
      return total + projectProfit;
    }, 0);
  };

  const activeProjects = (allProjects || []).filter(p => p.status === 'active');
  const completedProjects = (allProjects || []).filter(p => p.status === 'completed');
  
  const totalActiveProjects = activeProjects.length;
  const totalCompletedProjects = completedProjects.length;
  const totalProjects = totalActiveProjects + totalCompletedProjects;
  
  const completedProjectsProfit = getTotalProfit(completedProjects);
  const activeProjectsProfit = getTotalProfit(activeProjects);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      
      {/* Stats Section - Using transparent cards from theme */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        
        {/* Special Blue Card - Keeping Gradient */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          border: 'none'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Projects
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
                  {totalProjects}
                </Typography>
              </Box>
              <FolderIcon sx={{ fontSize: 40, opacity: 0.3 }} />
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {totalActiveProjects} active • {totalCompletedProjects} completed
            </Typography>
          </CardContent>
        </Card>

        {/* Standard Cards - Now Transparent Glass via Theme */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                  Active Projects
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, color: 'primary.main', fontWeight: 800 }}>
                  {totalActiveProjects}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.5, color: 'primary.main' }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              In progress
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                  Completed
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, color: 'success.main', fontWeight: 800 }}>
                  {totalCompletedProjects}
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.5, color: 'success.main' }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Finished projects
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: '1px solid', borderColor: 'success.main' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                  Total Profit
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, color: 'success.main', fontWeight: 700 }}>
                  {completedProjectsProfit.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                  AED
                </Typography>
              </Box>
              <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.5, color: 'success.main' }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              From completed projects
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Active Revenue Card */}
      {activeProjectsProfit > 0 && (
        <Card sx={{ mb: 4, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid', borderColor: 'success.main' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ color: 'success.main', mb: 0.5, fontWeight: 700 }}>
                  💰 Current Revenue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net profit from completed tasks in active projects
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 800 }}>
                  {activeProjectsProfit.toLocaleString()} AED
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Net earnings (revenue - expenses)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Reminders / Deadlines */}
      {reminders.length > 0 && (
        <Card sx={{ mb: 4, bgcolor: 'rgba(59, 130, 246, 0.1)', border: '1px solid', borderColor: 'primary.main' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <WarningAmberIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                UPCOMING DEADLINES
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {reminders.slice(0, 5).map((reminder, idx) => (
                <Chip 
                  key={idx}
                  label={`${reminder.name}: ${reminder.daysLeft === 0 ? 'DUE TODAY' : reminder.daysLeft + ' DAYS LEFT'}`}
                  color="error"
                  variant="outlined"
                  sx={{ fontWeight: 700, bgcolor: 'rgba(220, 38, 38, 0.1)' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Project List Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>Active Projects</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)' }}
            >
              <MenuItem value="all">All Projects</MenuItem>
              <MenuItem value="upcoming">Due Soon</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCurrentPage('create')}
            size="large"
            sx={{ fontWeight: 700 }}
          >
            New Project
          </Button>
        </Box>
      </Box>
      
      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 15 }}>
            <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
              No projects yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Create your first project to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCurrentPage('create')}
            >
              Create Project
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
          {filteredProjects.map(project => (
            <Box key={project.id}>
              <ProjectCard 
                project={project} 
                onClick={() => handleProjectClick(project)}
                onDelete={onDeleteProject}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
