import React, { useState } from 'react';
import { 
  Box, Container, Card, CardContent, TextField, Button, 
  Typography, Alert, CircularProgress 
} from '@mui/material';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '', companyName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    if (isSignUp && !formData.companyName) {
      setError('Please enter your company name');
      setIsLoading(false);
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) throw new Error('Invalid email format');
      if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
      
      onLogin({
        email: formData.email,
        companyName: formData.companyName || formData.email.split('@')[0],
        loginTime: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1114 0%, #1a1d23 100%)',
      p: 3
    }}>
      <Container maxWidth="sm">
        <Card elevation={24} sx={{ borderRadius: 4 }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
            p: 6,
            textAlign: 'center',
            borderBottom: '3px solid',
            borderColor: 'primary.main'
          }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Project Scheduler
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your company projects efficiently
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              {isSignUp && (
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
              )}
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <Button 
                    size="small" 
                    onClick={() => setIsSignUp(!isSignUp)}
                    sx={{ ml: 1, textTransform: 'none' }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
