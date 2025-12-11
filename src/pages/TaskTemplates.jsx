import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  TextField, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Chip, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';

export default function TaskTemplates({ setCurrentPage }) {
  const [templates, setTemplates] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    tasks: []
  });
  const [newTaskName, setNewTaskName] = useState('');

  // Dark Input Style
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

  // Load templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taskTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = (updatedTemplates) => {
    localStorage.setItem('taskTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const handleOpenCreate = () => {
    setNewTemplate({ name: '', description: '', tasks: [] });
    setEditingTemplate(null);
    setCreateDialogOpen(true);
  };

  const handleOpenEdit = (template) => {
    setNewTemplate({ ...template });
    setEditingTemplate(template.id);
    setCreateDialogOpen(true);
  };

  const handleAddTaskToTemplate = () => {
    if (!newTaskName.trim()) return;
    
    setNewTemplate({
      ...newTemplate,
      tasks: [...newTemplate.tasks, { id: Date.now(), name: newTaskName }]
    });
    setNewTaskName('');
  };

  const handleRemoveTaskFromTemplate = (taskId) => {
    setNewTemplate({
      ...newTemplate,
      tasks: newTemplate.tasks.filter(t => t.id !== taskId)
    });
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || newTemplate.tasks.length === 0) {
      alert('Please add a template name and at least one task');
      return;
    }

    let updatedTemplates;
    
    if (editingTemplate) {
      // Update existing
      updatedTemplates = templates.map(t => 
        t.id === editingTemplate ? { ...newTemplate, id: editingTemplate } : t
      );
    } else {
      // Create new
      updatedTemplates = [...templates, { ...newTemplate, id: Date.now() }];
    }

    saveTemplates(updatedTemplates);
    setCreateDialogOpen(false);
    setNewTemplate({ name: '', description: '', tasks: [] });
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Delete this template?')) {
      saveTemplates(templates.filter(t => t.id !== id));
    }
  };

  const handleDuplicateTemplate = (template) => {
    const duplicated = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`
    };
    saveTemplates([...templates, duplicated]);
  };

  const handleExportTemplate = (template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}_template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            Task Templates
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage('dashboard')}
              sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Create Template
            </Button>
          </Box>
        </Box>

        {templates.length === 0 ? (
          <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', py: 8 }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#94a3b8', mb: 2 }}>
                No templates yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Create reusable task templates to speed up project creation
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
              >
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {templates.map((template) => (
              <Card key={template.id} sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                        {template.description || 'No description'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${template.tasks.length} tasks`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee', fontWeight: 700 }} 
                    />
                  </Box>

                  <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 700, mb: 1, display: 'block' }}>
                      Tasks
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.tasks.slice(0, 5).map((task) => (
                        <Chip
                          key={task.id}
                          label={task.name}
                          size="small"
                          sx={{ bgcolor: 'rgba(51, 65, 85, 0.6)', color: 'white', fontSize: '0.75rem' }}
                        />
                      ))}
                      {template.tasks.length > 5 && (
                        <Chip
                          label={`+${template.tasks.length - 5} more`}
                          size="small"
                          sx={{ bgcolor: 'rgba(51, 65, 85, 0.6)', color: '#94a3b8', fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(template)}
                      sx={{ color: '#22d3ee' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => handleDuplicateTemplate(template)}
                      sx={{ color: '#94a3b8' }}
                    >
                      Duplicate
                    </Button>
                    <Button
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={() => handleExportTemplate(template)}
                      sx={{ color: '#10b981' }}
                    >
                      Export
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTemplate(template.id)}
                      sx={{ color: '#ef4444', ml: 'auto' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* CREATE/EDIT DIALOG */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {editingTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              placeholder="e.g. Standard 5-Phase Project"
              fullWidth
              sx={darkInputStyle}
            />
            
            <TextField
              label="Description (Optional)"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              placeholder="Brief description of when to use this template"
              fullWidth
              multiline
              rows={2}
              sx={darkInputStyle}
            />

            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 700 }}>
              Tasks
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Task name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTaskToTemplate()}
                fullWidth
                size="small"
                sx={darkInputStyle}
              />
              <Button
                variant="contained"
                onClick={handleAddTaskToTemplate}
                sx={{ minWidth: 60 }}
              >
                <AddIcon />
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 300, overflowY: 'auto' }}>
              {newTemplate.tasks.length === 0 ? (
                <Typography sx={{ color: '#64748b', textAlign: 'center', py: 2, fontSize: '0.875rem' }}>
                  No tasks added yet
                </Typography>
              ) : (
                newTemplate.tasks.map((task, index) => (
                  <Box
                    key={task.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      bgcolor: 'rgba(51, 65, 85, 0.4)',
                      borderRadius: 1,
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <Chip 
                      label={index + 1} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700 }} 
                    />
                    <Typography sx={{ flex: 1, color: 'white' }}>{task.name}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveTaskFromTemplate(task.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveTemplate}
            disabled={!newTemplate.name || newTemplate.tasks.length === 0}
          >
            {editingTemplate ? 'Update' : 'Create'} Template
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
