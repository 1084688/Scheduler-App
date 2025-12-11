import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Badge } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ProfileDialog from './ProfileDialog';

export default function Navbar({ user, onLogout, onUpdateUser, currentPage, setCurrentPage, trashCount }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '3px solid',
          borderColor: 'primary.main',
          top: 0,
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              width: 200
            }}
            onClick={() => setCurrentPage('dashboard')}
          >
            digitraffic
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center'
          }}>
            <Button 
              color={currentPage === 'dashboard' ? 'primary' : 'inherit'}
              startIcon={<DashboardIcon />}
              onClick={() => setCurrentPage('dashboard')}
              variant={currentPage === 'dashboard' ? 'contained' : 'text'}
            >
              Dashboard
            </Button>
            
            <Button 
              color={currentPage === 'calendar' ? 'primary' : 'inherit'}
              startIcon={<CalendarMonthIcon />}
              onClick={() => setCurrentPage('calendar')}
              variant={currentPage === 'calendar' ? 'contained' : 'text'}
            >
              Calendar
            </Button>
            
            <Button 
              color={currentPage === 'create' ? 'primary' : 'inherit'}
              startIcon={<AddIcon />}
              onClick={() => setCurrentPage('create')}
              variant={currentPage === 'create' ? 'contained' : 'text'}
            >
              New Project
            </Button>
            
            <Button 
              color={currentPage === 'completed' ? 'primary' : 'inherit'}
              startIcon={<CheckCircleIcon />}
              onClick={() => setCurrentPage('completed')}
              variant={currentPage === 'completed' ? 'contained' : 'text'}
            >
              Completed
            </Button>
            <Button
  onClick={() => setCurrentPage('templates')}
  sx={{
    color: currentPage === 'templates' ? '#22d3ee' : '#cbd5e1',
    fontWeight: currentPage === 'templates' ? 700 : 400
  }}
>
  Templates
</Button>

            <Button 
              color={currentPage === 'trash' ? 'primary' : 'inherit'}
              startIcon={
                <Badge badgeContent={trashCount} color="error" max={99}>
                  <DeleteIcon />
                </Badge>
              }
              onClick={() => setCurrentPage('trash')}
              variant={currentPage === 'trash' ? 'contained' : 'text'}
            >
              Trash
            </Button>
          </Box>
            
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 200, justifyContent: 'flex-end' }}>
            <IconButton 
              onClick={() => setProfileOpen(true)}
              sx={{
                bgcolor: 'secondary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                  '& .MuiAvatar-root': {
                    bgcolor: 'white',
                    color: 'primary.main'
                  }
                }
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <PersonIcon sx={{ fontSize: 20 }} />
              </Avatar>
            </IconButton>
            
            <Button 
              size="small"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              variant="outlined"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {user && (
        <ProfileDialog 
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={user}
          onUpdateUser={onUpdateUser}
        />
      )}
    </>
  );
}
