import React, { useState } from 'react';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Chip, LinearProgress, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Checkbox,
  FormControlLabel, Collapse
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import ConfirmDialog from '../components/ConfirmDialog';
import ProjectDetailsBottomNav from '../components/ProjectDetailsBottomNav';
import FormattedNumberInput from '../components/FormattedNumberInput';

export default function ProjectDetails({ 
  project, 
  onUpdateProject, 
  onMarkComplete,
  onDeleteProject, 
  setCurrentPage, 
  setSelectedProject 
}) {
  const [editNotesOpen, setEditNotesOpen] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [addingExpenseToTask, setAddingExpenseToTask] = useState(null);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  // Dark Mode Input Style Helper
  const darkInputStyle = {
    '& .MuiOutlinedInput-root': { 
      bgcolor: 'rgba(30, 41, 59, 0.5)', 
      color: 'white'
    },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
  };

  const formatDate = (date) => 
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const isPast = (date) => new Date(date) < new Date();
  
  const differenceInDays = (date1, date2) => 
    Math.ceil((new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24));

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 3, color: 'white' }}>
          Project not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setCurrentPage && setCurrentPage('dashboard')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // --- SAFE UPDATE HELPER ---
  const safeUpdate = (updatedProject) => {
    if (setSelectedProject) {
      setSelectedProject(updatedProject);
    }
    onUpdateProject(updatedProject.id, updatedProject);
  };

  const toggleTaskComplete = (taskId) => {
    const updatedTasks = project.subTasks.map(task =>
      task.id === taskId ? {
        ...task,
        completed: !task.completed,
        completedDate: !task.completed ? new Date().toISOString() : null
      } : task
    );
    safeUpdate({ ...project, subTasks: updatedTasks });
  };

  const toggleTaskPayment = (taskId) => {
    const updatedTasks = project.subTasks.map(task =>
      task.id === taskId ? {
        ...task,
        paymentReceived: !task.paymentReceived,
        paymentReceivedDate: !task.paymentReceived ? new Date().toISOString() : null
      } : task
    );
    safeUpdate({ ...project, subTasks: updatedTasks });
  };

  const handleMarkProjectComplete = () => {
    onMarkComplete(project.id);
    setConfirmCompleteOpen(false);
    if (setCurrentPage) setCurrentPage('completed');
  };

  const handleDeleteProject = () => {
    onDeleteProject(project.id);
    setConfirmDeleteOpen(false);
    if (setCurrentPage) setCurrentPage('dashboard');
  };

  const handleOpenNotes = () => {
    setTempNotes(project.notes || '');
    setEditNotesOpen(true);
  };

  const handleSaveNotes = () => {
    safeUpdate({ ...project, notes: tempNotes });
    setEditNotesOpen(false);
  };

  const handleEditTask = (taskId) => {
    const task = project.subTasks.find(t => t.id === taskId);
    setEditingTask({
      id: taskId,
      name: task.name,
      deadline: task.deadline,
      percentage: task.percentage || 0,
      notes: task.notes || ''
    });
  };

  const handleSaveTaskEdit = () => {
    const updatedTasks = project.subTasks.map(task =>
      task.id === editingTask.id ? {
        ...task,
        name: editingTask.name,
        deadline: editingTask.deadline,
        percentage: editingTask.percentage,
        notes: editingTask.notes
      } : task
    );
    safeUpdate({ ...project, subTasks: updatedTasks });
    setEditingTask(null);
  };

  const handleCancelTaskEdit = () => {
    setEditingTask(null);
  };

  const handleAddExpense = (taskId) => {
    if (!newExpense.description || !newExpense.amount) return;

    const updatedTasks = project.subTasks.map(task => {
      if (task.id === taskId) {
        const currentExpenses = Array.isArray(task.expenses) ? task.expenses : [];
        return {
          ...task,
          expenses: [...currentExpenses, {
            id: Date.now(),
            description: newExpense.description,
            amount: parseFloat(newExpense.amount) || 0
          }]
        };
      }
      return task;
    });

    safeUpdate({ ...project, subTasks: updatedTasks });
    setNewExpense({ description: '', amount: '' });
    setAddingExpenseToTask(null);
  };

  const handleRemoveExpense = (taskId, expenseId) => {
    const updatedTasks = project.subTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          expenses: task.expenses.filter(e => e.id !== expenseId)
        };
      }
      return task;
    });
    safeUpdate({ ...project, subTasks: updatedTasks });
  };

  const toggleTaskExpanded = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calculateTaskPayment = (task) => {
    if (project.projectMode === 'awarded') {
      return Math.round((project.myProfit * (task.percentage || 0)) / 100);
    }
    return 0;
  };

  const calculateTaskExpenses = (task) => {
    if (!task.expenses) return 0;
    if (!Array.isArray(task.expenses)) return 0;
    return task.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  };

  const getProgress = () => {
    if (!project.subTasks || project.subTasks.length === 0) return 0;
    return Math.round((project.subTasks.filter(t => t.completed).length / project.subTasks.length) * 100);
  };

  const getPaidAmount = () => 
    project.subTasks.reduce((sum, t) => sum + (t.paymentReceived ? calculateTaskPayment(t) : 0), 0);

  const getTotalRevenue = () =>
    project.subTasks.reduce((sum, t) => sum + calculateTaskPayment(t), 0);

  const getTotalExpenses = () =>
    project.subTasks.reduce((sum, t) => sum + calculateTaskExpenses(t), 0);

  const getNetProfit = () => getTotalRevenue() - getTotalExpenses();

  const getDeadlineColor = (deadline, completed) => {
    if (completed) return 'success.main';
    const days = differenceInDays(new Date(deadline), new Date());
    if (days < 0) return 'error.main';
    if (days <= 7) return 'warning.main';
    return 'text.secondary';
  };

  const allTasksCompleted = project.subTasks?.every(t => t.completed);
  const progress = getProgress();
  const daysRemaining = differenceInDays(new Date(project.deadline), new Date());

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6, pb: 15 }}>
        
        {/* HEADER CARD */}
        <Card sx={{ mb: 4, bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                {project.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {project.projectMode && (
                  <Chip 
                    label={project.projectMode === 'awarded' ? 'AWARDED' : 'STUDY'}
                    color={project.projectMode === 'awarded' ? 'success' : 'warning'}
                    sx={{ fontWeight: 700, fontSize: '0.875rem' }}
                  />
                )}
                <Chip 
                  label={
                    project.status === 'completed' 
                      ? 'COMPLETED' 
                      : isPast(project.deadline) 
                        ? 'OVERDUE' 
                        : 'ACTIVE'
                  }
                  color={
                    project.status === 'completed' 
                      ? 'info' 
                      : isPast(project.deadline) 
                        ? 'error' 
                        : 'success'
                  }
                  sx={{ fontWeight: 700, fontSize: '0.875rem' }}
                />
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2, color: '#94a3b8' }}>
              {project.description || 'No description provided'}
            </Typography>

            {project.notes && (
              <Box sx={{ 
                bgcolor: 'rgba(30, 41, 59, 0.5)', 
                p: 2, 
                borderRadius: 2, 
                border: '1px solid rgba(255,255,255,0.1)',
                mb: 2
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>
                    Project Notes
                  </Typography>
                  <IconButton size="small" onClick={handleOpenNotes} sx={{ color: '#94a3b8' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'white' }}>
                  {project.notes}
                </Typography>
              </Box>
            )}

            {!project.notes && (
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<EditIcon />}
                onClick={handleOpenNotes}
                sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Add Notes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* STATS GRID */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 3, 
          mb: 4 
        }}>
          <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                Deadline
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, color: 'white', fontWeight: 700 }}>
                {formatDate(project.deadline)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {daysRemaining} days remaining
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                {project.projectMode === 'awarded' ? 'Paid Amount' : 'Revenue'}
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, color: '#22d3ee', fontWeight: 700 }}>
                {getPaidAmount().toLocaleString()} <span style={{ fontSize: '0.8em' }}>AED</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {project.projectMode === 'awarded' ? `of ${getTotalRevenue().toLocaleString()} AED` : 'From completed tasks'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                Expenses
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, color: '#ef4444', fontWeight: 700 }}>
                {getTotalExpenses().toLocaleString()} <span style={{ fontSize: '0.8em' }}>AED</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Total spent
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                Net Profit
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, color: getNetProfit() >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                {getNetProfit().toLocaleString()} <span style={{ fontSize: '0.8em' }}>AED</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Revenue - Expenses
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* OVERALL PROGRESS */}
        <Card sx={{ mb: 4, bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                Overall Progress
              </Typography>
              <Typography variant="h4" sx={{ color: '#22d3ee', fontWeight: 700 }}>
                {progress}%
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 12, 
                borderRadius: 2, 
                mb: 2,
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)'
                }
              }}
            />
            
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {project.subTasks?.filter(t => t.completed).length || 0} of {project.subTasks?.length || 0} tasks completed
            </Typography>
          </CardContent>
        </Card>

        {/* TASKS LIST */}
        <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>
              Project Tasks
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {project.subTasks?.map((task) => {
                const isEditing = editingTask?.id === task.id;
                const isExpanded = expandedTasks[task.id];
                const taskPayment = calculateTaskPayment(task);
                const taskExpenses = calculateTaskExpenses(task);
                const taskProfit = taskPayment - taskExpenses;
                const taskDaysRemaining = differenceInDays(new Date(task.deadline), new Date());

                return (
                  <Card 
                    key={task.id} 
                    sx={{ 
                      bgcolor: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid',
                      borderColor: task.completed ? '#10b981' : 'rgba(255,255,255,0.1)',
                      borderLeftWidth: '4px'
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          {isEditing ? (
                            <TextField
                              fullWidth
                              size="small"
                              value={editingTask.name}
                              onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                              sx={{ mb: 1.5, ...darkInputStyle }}
                            />
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                {task.name}
                              </Typography>
                              {task.completed && <Chip label="✓" size="small" color="success" sx={{ height: 20, fontWeight: 700 }} />}
                              {project.projectMode === 'awarded' && task.paymentReceived && <Chip label="$" size="small" color="success" variant="outlined" sx={{ height: 20, fontWeight: 700 }} />}
                            </Box>
                          )}

                          {isEditing ? (
                            <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                              <DatePicker
                                label="Deadline"
                                value={dayjs(editingTask.deadline)}
                                onChange={(newValue) => setEditingTask({ ...editingTask, deadline: newValue.format('YYYY-MM-DD') })}
                                slotProps={{ 
                                  textField: { 
                                    size: 'small', 
                                    sx: darkInputStyle 
                                  } 
                                }}
                              />
                              
                              <FormattedNumberInput
                                size="small"
                                label="Payment %"
                                value={editingTask.percentage}
                                onChange={(e) => setEditingTask({ ...editingTask, percentage: parseFloat(e.target.value) || 0 })}
                                inputProps={{ step: "0.1", max: 100 }}
                                sx={{ width: 120, ...darkInputStyle }}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', gap: 3, mb: 1.5, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ color: getDeadlineColor(task.deadline, task.completed) }}>
                                <strong>Deadline:</strong> {formatDate(task.deadline)} ({taskDaysRemaining}d)
                              </Typography>

                              {project.projectMode === 'awarded' && (
                                <>
                                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    <strong>Payment:</strong> {task.percentage}% = <span style={{ color: '#22d3ee' }}>{taskPayment.toLocaleString()} AED</span>
                                  </Typography>

                                  <Typography variant="body2" sx={{ color: '#ef4444' }}>
                                    <strong>Expenses:</strong> {taskExpenses.toLocaleString()} AED
                                  </Typography>

                                  <Typography variant="body2" sx={{ color: taskProfit >= 0 ? '#10b981' : '#ef4444' }}>
                                    <strong>Profit:</strong> {taskProfit.toLocaleString()} AED
                                  </Typography>
                                </>
                              )}
                            </Box>
                          )}

                          {!isEditing && (
                            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                              <FormControlLabel
                                control={
                                  <Checkbox 
                                    size="small"
                                    checked={task.completed || false}
                                    onChange={() => toggleTaskComplete(task.id)}
                                    disabled={project.status === 'completed'}
                                    color="success"
                                    sx={{ color: '#94a3b8' }}
                                  />
                                }
                                label={<Typography variant="body2" sx={{ color: 'white' }}>Completed</Typography>}
                              />

                              {project.projectMode === 'awarded' && (
                                <FormControlLabel
                                  control={
                                    <Checkbox 
                                      size="small"
                                      checked={task.paymentReceived || false}
                                      onChange={() => toggleTaskPayment(task.id)}
                                      disabled={project.status === 'completed'}
                                      color="success"
                                      sx={{ color: '#94a3b8' }}
                                    />
                                  }
                                  label={<Typography variant="body2" sx={{ color: 'white' }}>Payment Received</Typography>}
                                />
                              )}
                            </Box>
                          )}

                          {/* EXPENSES CHIPS */}
                          {!isEditing && project.projectMode === 'awarded' && task.expenses && Array.isArray(task.expenses) && task.expenses.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                              {task.expenses.map(expense => (
                                <Chip
                                  key={expense.id}
                                  label={`${expense.description}: ${expense.amount.toLocaleString()} AED`}
                                  size="small"
                                  onDelete={project.status !== 'completed' ? () => handleRemoveExpense(task.id, expense.id) : undefined}
                                  sx={{ 
                                    height: 24, 
                                    fontSize: '0.75rem', 
                                    bgcolor: 'rgba(239, 68, 68, 0.2)', 
                                    color: '#fca5a5',
                                    '& .MuiChip-deleteIcon': { color: '#fca5a5' }
                                  }}
                                />
                              ))}
                            </Box>
                          )}

                          {/* BUTTONS */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {isEditing ? (
                              <>
                                <Button size="small" variant="contained" onClick={handleSaveTaskEdit} sx={{ minWidth: 70 }}>
                                  Save
                                </Button>
                                <Button size="small" variant="outlined" onClick={handleCancelTaskEdit} sx={{ minWidth: 70 }}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                {project.status !== 'completed' && (
                                  <>
                                    <Button size="small" onClick={() => handleEditTask(task.id)} sx={{ color: '#94a3b8' }}>Edit</Button>
                                    
                                    {project.projectMode === 'awarded' && (
                                      <Button
                                        size="small"
                                        onClick={() => setAddingExpenseToTask(addingExpenseToTask === task.id ? null : task.id)}
                                        sx={{ color: '#ef4444' }}
                                      >
                                        {addingExpenseToTask === task.id ? 'Cancel' : '+ Expense'}
                                      </Button>
                                    )}
                                  </>
                                )}

                                <Button size="small" onClick={() => toggleTaskExpanded(task.id)} sx={{ color: '#94a3b8' }}>
                                  {isExpanded ? '▲ Less' : '▼ More'}
                                </Button>
                              </>
                            )}
                          </Box>

                          {/* ADD EXPENSE INPUTS */}
                          {addingExpenseToTask === task.id && (
                            <Box sx={{ mt: 1.5, p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 1, border: '1px dashed #ef4444' }}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  size="small"
                                  label="Description"
                                  value={newExpense.description}
                                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                  sx={{ flex: 2, ...darkInputStyle }}
                                />
                                <FormattedNumberInput
                                  size="small"
                                  label="Amount (AED)"
                                  value={newExpense.amount}
                                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                  sx={{ flex: 1, ...darkInputStyle }}
                                />
                                <Button size="small" variant="contained" color="error" onClick={() => handleAddExpense(task.id)} sx={{ minWidth: 60 }}>
                                  Save
                                </Button>
                              </Box>
                            </Box>
                          )}

                          {/* EXPANDED NOTES */}
                          <Collapse in={isExpanded} timeout="auto">
                            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                                Notes
                              </Typography>
                              
                              {isEditing ? (
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  size="small"
                                  value={editingTask.notes}
                                  onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                                  placeholder="Add notes..."
                                  sx={darkInputStyle}
                                />
                              ) : (
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                  {task.notes || 'No notes'}
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Container>

      <ProjectDetailsBottomNav
        onBack={() => {
           if (setCurrentPage) setCurrentPage('dashboard');
        }}
        onMarkComplete={() => setConfirmCompleteOpen(true)}
        onDelete={() => setConfirmDeleteOpen(true)}
        canMarkComplete={allTasksCompleted && project.status === 'active'}
      />

      <Dialog 
        open={editNotesOpen} 
        onClose={() => setEditNotesOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#1e293b', color: 'white' }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Project Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            placeholder="Add notes about this project..."
            sx={{ mt: 1, ...darkInputStyle }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNotesOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNotes}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmCompleteOpen}
        onClose={() => setConfirmCompleteOpen(false)}
        onConfirm={handleMarkProjectComplete}
        title="Mark Project as Complete?"
        message="This will move the project to your completed projects archive. You can view it anytime in the Completed section."
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.name}"? It will be moved to the trash bin.`}
      />
    </>
  );
}
