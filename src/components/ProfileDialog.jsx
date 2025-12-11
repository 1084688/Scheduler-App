import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, 
  TextField, Button, Divider, Avatar, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ProfileDialog({ open, onClose, user, onUpdateUser }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update name when user changes or dialog opens
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  // Early return if no user
  if (!user) return null;

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const updatedUser = { ...user, name: name.trim() };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChangePassword = () => {
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (currentPassword !== user.password) {
      setError('Current password is incorrect');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setSuccess('Password changed successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '2px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <PersonIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h3">Account Settings</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'error.main'
          }}>
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              ⚠️ {error}
            </Typography>
          </Box>
        )}

        {success && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'success.main'
          }}>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
              ✓ {success}
            </Typography>
          </Box>
        )}

        {/* Profile Info Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Profile Information
          </Typography>
          
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            value={user.email}
            disabled
            helperText="Email cannot be changed"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleUpdateProfile}
            fullWidth
          >
            Update Profile
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Change Password Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LockIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h4">
              Change Password
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            type={showCurrentPassword ? 'text' : 'password'}
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimum 6 characters"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<LockIcon />}
            onClick={handleChangePassword}
            fullWidth
          >
            Change Password
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Account Stats */}
        <Box sx={{ p: 3, bgcolor: 'secondary.main', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
            ACCOUNT INFORMATION
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Account Type</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Premium</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
