import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, TextField, Typography, Button, IconButton, Chip, Divider, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import dayjs from 'dayjs';
import FormattedNumberInput from './FormattedNumberInput';

export default function TaskManager({ projectData, setProjectData, onNext, onBack }) {
  const [newTask, setNewTask] = useState({ 
    name: '', 
    deadline: dayjs(projectData.deadline),
    percentage: '' 
  });

  // Quick Template State
  const [templateMode, setTemplateMode] = useState(false);
  const [numTasks, setNumTasks] = useState('');
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState([]);

  // Load templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taskTemplates');
    if (saved) {
      setAvailableTemplates(JSON.parse(saved));
    }
  }, []);

  const darkInputStyle = {
    '& .MuiOutlinedInput-root': { 
      bgcolor: 'rgba(51, 65, 85, 0.6)',
      color: 'white',
      borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 0.8 }
  };

  const handleAddTask = () => {
    if (!newTask.name) return;
    
    const task = {
      id: Date.now(),
      name: newTask.name,
      deadline: newTask.deadline.format('YYYY-MM-DD'),
      percentage: parseFloat(newTask.percentage) || 0,
      completed: false,
      paymentReceived: false,
      expenses: []
    };

    setProjectData({
      ...projectData,
      subTasks: [...projectData.subTasks, task]
    });

    setNewTask({ ...newTask, name: '', percentage: '' });
  };

  const handleGenerateTemplate = () => {
    const count = parseInt(numTasks);
    if (!count || count < 1 || count > 20) return;

    const projectStart = dayjs(projectData.deadline).subtract(1, 'year');
    const projectEnd = dayjs(projectData.deadline);
    const duration = projectEnd.diff(projectStart, 'days');
    const interval = Math.floor(duration / count);
    const percentagePerTask = projectData.projectMode === 'awarded' ? Math.floor(100 / count) : 0;

    const generatedTasks = [];
    for (let i = 0; i < count; i++) {
      generatedTasks.push({
        id: Date.now() + i,
        name: `Phase ${i + 1}`,
        deadline: projectStart.add(interval * (i + 1), 'days').format('YYYY-MM-DD'),
        percentage: percentagePerTask,
        completed: false,
        paymentReceived: false,
        expenses: []
      });
    }

    setProjectData({
      ...projectData,
      subTasks: generatedTasks
    });

    setTemplateMode(false);
    setNumTasks('');
  };

  const handleLoadTemplate = (template) => {
    const projectStart = dayjs(projectData.deadline).subtract(1, 'year');
    const projectEnd = dayjs(projectData.deadline);
    const duration = projectEnd.diff(projectStart, 'days');
    const interval = Math.floor(duration / template.tasks.length);
    const percentagePerTask = projectData.projectMode === 'awarded' ? Math.floor(100 / template.tasks.length) : 0;

    const loadedTasks = template.tasks.map((task, i) => ({
      id: Date.now() + i,
      name: task.name,
      deadline: projectStart.add(interval * (i + 1), 'days').format('YYYY-MM-DD'),
      percentage: percentagePerTask,
      completed: false,
      paymentReceived: false,
      expenses: []
    }));

    setProjectData({
      ...projectData,
      subTasks: loadedTasks
    });

    setLoadTemplateOpen(false);
  };

  const removeTask = (id) => {
    setProjectData({
      ...projectData,
      subTasks: projectData.subTasks.filter(t => t.id !== id)
    });
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'block', fontWeight: 700 }}>
        PHASES & FINANCIALS
      </Typography>

      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          
          {/* LOAD SAVED TEMPLATE */}
          {availableTemplates.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => setLoadTemplateOpen(true)}
              sx={{ 
                mb: 2, 
                color: '#10b981', 
                borderColor: 'rgba(16, 185, 129, 0.3)',
                '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' }
              }}
            >
              Load From Saved Template ({availableTemplates.length})
            </Button>
          )}

          {/* QUICK TEMPLATE GENERATOR */}
          {!templateMode ? (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setTemplateMode(true)}
              sx={{ 
                mb: 3, 
                color: '#22d3ee', 
                borderColor: 'rgba(34, 211, 238, 0.3)',
                '&:hover': { borderColor: '#22d3ee', bgcolor: 'rgba(34, 211, 238, 0.1)' }
              }}
            >
              Quick Template: Auto-Generate Tasks
            </Button>
          ) : (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(34, 211, 238, 0.1)', borderRadius: 2, border: '1px solid #22d3ee' }}>
              <Typography variant="subtitle2" sx={{ color: '#22d3ee', mb: 2, fontWeight: 700 }}>
                ⚡ Quick Template Generator
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  type="number"
                  placeholder="Number of tasks (1-20)"
                  value={numTasks}
                  onChange={(e) => setNumTasks(e.target.value)}
                  inputProps={{ min: 1, max: 20 }}
                  sx={{ flex: 1, ...darkInputStyle }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleGenerateTemplate}
                  disabled={!numTasks || parseInt(numTasks) < 1}
                  sx={{ bgcolor: '#22d3ee', '&:hover': { bgcolor: '#06b6d4' } }}
                >
                  Generate
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => { setTemplateMode(false); setNumTasks(''); }}
                  sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  Cancel
                </Button>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#94a3b8' }}>
                This will create evenly distributed phases with equal payment splits
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* Add Task Form */}
          <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'block', fontWeight: 700 }}>
            ADD TASK MANUALLY
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr auto', gap: 2, alignItems: 'center', mb: 4 }}>
            <TextField
              placeholder="Task / Phase Name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              sx={darkInputStyle}
            />
            <DatePicker
              value={newTask.deadline}
              onChange={(newValue) => setNewTask({ ...newTask, deadline: newValue })}
              slotProps={{ textField: { sx: darkInputStyle } }}
            />
            {projectData.projectMode === 'awarded' && (
              <FormattedNumberInput
                placeholder="Pay %"
                value={newTask.percentage}
                onChange={(e) => setNewTask({ ...newTask, percentage: e.target.value })}
                sx={darkInputStyle}
              />
            )}
            <Button 
              variant="contained" 
              onClick={handleAddTask}
              sx={{ height: 56, minWidth: 56, borderRadius: 2 }}
            >
              <AddIcon />
            </Button>
          </Box>

          {/* Task List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {projectData.subTasks.length === 0 && (
              <Typography sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                No tasks added yet. Use the template generator or add manually above.
              </Typography>
            )}

            {projectData.subTasks.length > 0 && projectData.projectMode === 'awarded' && (
              <Alert 
                severity="info" 
                sx={{ 
                  bgcolor: 'rgba(34, 211, 238, 0.1)', 
                  color: '#22d3ee',
                  '& .MuiAlert-icon': { color: '#22d3ee' }
                }}
              >
                Total Payment: {projectData.subTasks.reduce((sum, t) => sum + (t.percentage || 0), 0)}%
              </Alert>
            )}

            {projectData.subTasks.map((task, index) => (
              <Card key={task.id} sx={{ bgcolor: 'rgba(51, 65, 85, 0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label={index + 1} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>{task.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>Due: {task.deadline}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {projectData.projectMode === 'awarded' && (
                      <Typography variant="body2" sx={{ color: '#22d3ee', fontWeight: 700 }}>
                        {task.percentage}% 
                      </Typography>
                    )}
                    <IconButton size="small" onClick={() => removeTask(task.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={onBack} sx={{ color: '#94a3b8' }}>Back</Button>
            <Button variant="contained" onClick={onNext} disabled={projectData.subTasks.length === 0}>
              Review & Finish
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* LOAD TEMPLATE DIALOG */}
      <Dialog 
        open={loadTemplateOpen} 
        onClose={() => setLoadTemplateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Load Template</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {availableTemplates.map((template) => (
              <Card 
                key={template.id}
                onClick={() => handleLoadTemplate(template)}
                sx={{ 
                  bgcolor: 'rgba(51, 65, 85, 0.4)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(51, 65, 85, 0.6)', borderColor: '#22d3ee', transform: 'scale(1.02)' }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                        {template.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {template.description || 'No description'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${template.tasks.length} tasks`}
                      size="small"
                      sx={{ bgcolor: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee', fontWeight: 700 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadTemplateOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
