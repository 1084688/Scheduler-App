import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, TextField, 
  Button, InputAdornment, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import ValidationPopup from '../components/ValidationPopup';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [validationError, setValidationError] = useState({ open: false, message: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setValidationError({ open: true, message: 'Please enter an API key' });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setValidationError({ open: true, message: 'Invalid OpenAI API key format. It should start with "sk-"' });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setSuccessMessage('API key saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setSuccessMessage('API key cleared!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ValidationPopup
        open={validationError.open}
        message={validationError.message}
        onClose={() => setValidationError({ open: false, message: '' })}
      />

      <Typography variant="h1" sx={{ mb: 4 }}>Settings</Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            OpenAI API Configuration
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            To use the AI Project Assistant, you need an OpenAI API key. Get your key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#dc2626' }}
            >
              OpenAI Dashboard
            </a>
            . Your key is stored locally in your browser and never sent to our servers.
          </Typography>

          <TextField
            fullWidth
            label="OpenAI API Key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowKey(!showKey)}>
                    {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          {successMessage && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'success.main'
            }}>
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                ✓ {successMessage}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save API Key
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
            >
              Clear Key
            </Button>
          </Box>

          <Box sx={{ mt: 4, p: 3, bgcolor: 'secondary.dark', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              💡 How to use AI Assistant
            </Typography>
            <Typography variant="body2" component="div" sx={{ lineHeight: 1.8 }}>
              1. Click the AI button in the bottom-right corner<br />
              2. Describe your project naturally: "I need to build an e-commerce website for $50,000, deadline in 6 months with 4 development phases"<br />
              3. The AI will ask for any missing details<br />
              4. Review the generated project and click "Create This Project"<br />
              5. The project will be added to your dashboard!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
