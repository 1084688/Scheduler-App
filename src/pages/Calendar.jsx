import React, { useState } from 'react';
import { 
  Container, Typography, Box, IconButton, Card, Paper, Chip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Calendar({ projects, setCurrentPage, setSelectedProject }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const projectColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  
  const getProjectColor = (projectId) => {
    const index = projects.findIndex(p => p.id === projectId);
    return projectColors[index % projectColors.length];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getProjectsForDay = (day) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateToCheck = new Date(year, month, day);
    
    return projects.filter(project => {
      const projectStart = new Date(project.createdDate || new Date());
      const projectEnd = new Date(project.deadline);
      
      projectStart.setHours(0, 0, 0, 0);
      projectEnd.setHours(0, 0, 0, 0);
      dateToCheck.setHours(0, 0, 0, 0);
      
      return dateToCheck >= projectStart && dateToCheck <= projectEnd;
    });
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={previousMonth} size="large">
            <ChevronLeftIcon />
          </IconButton>
          
          <Typography variant="h2">
            {monthName}
          </Typography>
          
          <IconButton onClick={nextMonth} size="large">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Card>

      <Card sx={{ p: 2 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: 0.5, 
          mb: 0.5,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: 'divider'
        }}>
          {weekDays.map((day, idx) => (
            <Box key={idx} sx={{ textAlign: 'center', py: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem' }}>
                {day.toUpperCase()}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {calendarDays.map((day, idx) => {
            const dayProjects = getProjectsForDay(day);
            const isTodayDate = isToday(day);
            
            return (
              <Box
                key={idx}
                sx={{
                  minHeight: 70,
                  p: 0.5,
                  bgcolor: day ? (isTodayDate ? 'rgba(220, 38, 38, 0.1)' : 'background.paper') : 'transparent',
                  border: '1px solid',
                  borderColor: day ? (isTodayDate ? 'primary.main' : 'divider') : 'transparent',
                  borderRadius: 1,
                  cursor: day ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  '&:hover': day ? {
                    borderColor: 'secondary.light',
                    bgcolor: 'secondary.dark',
                    transform: 'scale(1.02)'
                  } : {}
                }}
              >
                {day && (
                  <>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: isTodayDate ? 'primary.main' : 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {day}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      {dayProjects.slice(0, 2).map(project => (
                        <Box
                          key={project.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            setCurrentPage('details');
                          }}
                          sx={{
                            bgcolor: getProjectColor(project.id),
                            color: 'white',
                            px: 0.5,
                            py: 0.2,
                            borderRadius: 0.5,
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.4,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                              transform: 'scale(1.02)'
                            }
                          }}
                          title={project.name}
                        >
                          {project.name}
                        </Box>
                      ))}
                      {dayProjects.length > 2 && (
                        <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary', fontWeight: 600, pl: 0.5 }}>
                          +{dayProjects.length - 2}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Active Projects Legend
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1.5
        }}>
          {projects.map(project => (
            <Box
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setCurrentPage('details');
              }}
              sx={{
                bgcolor: getProjectColor(project.id),
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                p: 1.5,
                borderRadius: 1,
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                wordBreak: 'break-word',
                fontSize: '0.875rem',
                lineHeight: 1.3,
                '&:hover': {
                  opacity: 0.8,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              {project.name}
            </Box>
          ))}
        </Box>
      </Card>
    </Container>
  );
}
