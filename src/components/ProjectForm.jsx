import React from 'react';
import { Card, CardContent, Box, TextField, Typography, Button, ToggleButtonGroup, ToggleButton, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormattedNumberInput from './FormattedNumberInput';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssignmentIcon from '@mui/icons-material/Assignment';
import dayjs from 'dayjs';

export default function ProjectForm({ projectData, setProjectData, onNext }) {
  
  const darkInputStyle = {
    '& .MuiOutlinedInput-root': { 
      bgcolor: 'rgba(51, 65, 85, 0.6)', // Lighter background
      color: 'white',
      borderRadius: 2,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.3)'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#22d3ee'
      }
    },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#22d3ee' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 0.8 }
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setProjectData({ ...projectData, projectMode: newMode });
    }
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'block', fontWeight: 700 }}>
        SELECT PROJECT TYPE
      </Typography>
      
      <ToggleButtonGroup
        value={projectData.projectMode}
        exclusive
        onChange={handleModeChange}
        fullWidth
        sx={{ mb: 4, gap: 2 }}
      >
        <ToggleButton 
          value="study"
          sx={{ 
            border: '1px solid rgba(255,255,255,0.1) !important', 
            borderRadius: '16px !important',
            color: 'white',
            justifyContent: 'flex-start',
            p: 3,
            bgcolor: 'rgba(15, 23, 42, 0.6)',
            '&.Mui-selected': { 
              bgcolor: 'rgba(6, 182, 212, 0.1) !important', 
              borderColor: '#06b6d4 !important',
              color: '#06b6d4'
            }
          }}
        >
          <LightbulbIcon sx={{ mr: 2, fontSize: 30 }} />
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Study / Bidding Phase</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Quick breakdown for estimates & proposals</Typography>
          </Box>
        </ToggleButton>

        <ToggleButton 
          value="awarded"
          sx={{ 
            border: '1px solid rgba(255,255,255,0.1) !important', 
            borderRadius: '16px !important',
            color: 'white',
            justifyContent: 'flex-start',
            p: 3,
            bgcolor: 'rgba(15, 23, 42, 0.6)',
            '&.Mui-selected': { 
              bgcolor: 'rgba(6, 182, 212, 0.1) !important', 
              borderColor: '#06b6d4 !important',
              color: '#06b6d4'
            }
          }}
        >
          <AssignmentIcon sx={{ mr: 2, fontSize: 30 }} />
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Awarded Project</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Full financial tracking & profit distribution</Typography>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'block', fontWeight: 700 }}>
        PROJECT DETAILS
      </Typography>

      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, mb: 3 }}>
            <Box>
              <InputLabel sx={{ color: '#cbd5e1', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                Project Name 
              </InputLabel>
              <TextField
                value={projectData.name}
                onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                fullWidth
                placeholder="e.g. Al Ain Traffic Control Center"
                sx={darkInputStyle}
              />
            </Box>
            <Box>
              <InputLabel sx={{ color: '#cbd5e1', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                Deadline 
              </InputLabel>
              <DatePicker
                value={dayjs(projectData.deadline)}
                onChange={(newValue) => setProjectData({ ...projectData, deadline: newValue.format('YYYY-MM-DD') })}
                slotProps={{ textField: { fullWidth: true, sx: darkInputStyle } }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <InputLabel sx={{ color: '#cbd5e1', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
              Description (Optional)
            </InputLabel>
            <TextField
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description of the project..."
              sx={darkInputStyle}
            />
          </Box>

          {projectData.projectMode === 'awarded' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
              <Box>
                <InputLabel sx={{ color: '#cbd5e1', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Project Worth (AED) 
                </InputLabel>
                <FormattedNumberInput
                  value={projectData.totalBudget}
                  onChange={(e) => setProjectData({ ...projectData, totalBudget: e.target.value })}
                  placeholder="50000"
                  sx={darkInputStyle}
                />
              </Box>
              <Box>
                <InputLabel sx={{ color: '#cbd5e1', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Your Profit % 
                </InputLabel>
                <FormattedNumberInput
                  value={projectData.myProfit}
                  onChange={(e) => setProjectData({ ...projectData, myProfit: e.target.value })}
                  placeholder="30"
                  inputProps={{ max: 100 }}
                  sx={darkInputStyle}
                />
              </Box>
              <Card sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                    Net Profit
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                    {(
                      (parseFloat(projectData.totalBudget?.toString().replace(/,/g, '') || 0) * 
                      (parseFloat(projectData.myProfit || 0) / 100)) || 0
                    ).toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={onNext}
              disabled={!projectData.name}
            >
              Next: Add Tasks
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
