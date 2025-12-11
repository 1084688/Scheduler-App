import React, { useState } from 'react';
import { 
  Paper, Box, Typography, Checkbox, IconButton, Chip, 
  Collapse, TextField, Button, Divider, Stack 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

export default function TaskItem({ task, project, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '' });

  // Calculate financials
  const taskPay = Math.round((project.myProfit * (task.percentage || 0)) / 100);
  const totalExpenses = (task.expenses || []).reduce((sum, ex) => sum + (Number(ex.amount) || 0), 0);
  const netProfit = taskPay - totalExpenses;

  const handleToggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed, completedDate: !task.completed ? new Date().toISOString() : null });
  };

  const handleTogglePaid = () => {
    onUpdate({ ...task, paymentReceived: !task.paymentReceived, paymentReceivedDate: !task.paymentReceived ? new Date().toISOString() : null });
  };

  const addExpense = () => {
    if (!newExpense.desc || !newExpense.amount) return;
    const expenseObj = { id: Date.now(), desc: newExpense.desc, amount: Number(newExpense.amount) };
    onUpdate({ ...task, expenses: [...(task.expenses || []), expenseObj] });
    setNewExpense({ desc: '', amount: '' });
  };

  const removeExpense = (expenseId) => {
    onUpdate({ ...task, expenses: task.expenses.filter(e => e.id !== expenseId) });
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #e2e8f0' }} elevation={0}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Checkbox checked={task.completed || false} onChange={handleToggleComplete} color="success" />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', mt: -0.5 }}>DONE</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {task.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due: {new Date(task.deadline).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {project.projectMode === 'awarded' && (
             <Box textAlign="right">
               <Typography variant="body2" fontWeight={600} color="primary">
                 {task.percentage}% ({taskPay.toLocaleString()} AED)
               </Typography>
               <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                 <Checkbox 
                    size="small" 
                    checked={task.paymentReceived || false} 
                    onChange={handleTogglePaid} 
                    sx={{ p: 0.5 }}
                 />
                 <Typography variant="caption" color={task.paymentReceived ? "success.main" : "text.secondary"}>
                   {task.paymentReceived ? "PAID" : "UNPAID"}
                 </Typography>
               </Box>
             </Box>
          )}
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Details: Expenses & Notes */}
      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />
        
        {project.projectMode === 'awarded' && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">EXPENSES</Typography>
              <Typography variant="caption" color={netProfit >= 0 ? 'success.main' : 'error.main'}>
                NET: {netProfit.toLocaleString()} AED
              </Typography>
            </Box>
            
            <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
              {(task.expenses || []).map(exp => (
                <Chip 
                  key={exp.id} 
                  label={`${exp.desc}: ${exp.amount} AED`} 
                  onDelete={() => removeExpense(exp.id)}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>

            <Box display="flex" gap={1}>
              <TextField 
                placeholder="Expense Item" 
                size="small" 
                value={newExpense.desc} 
                onChange={e => setNewExpense({ ...newExpense, desc: e.target.value })} 
              />
              <TextField 
                placeholder="Amount" 
                size="small" 
                type="number" 
                sx={{ width: 100 }}
                value={newExpense.amount} 
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} 
              />
              <Button variant="contained" size="small" onClick={addExpense} sx={{ minWidth: 40 }}>
                <AddIcon fontSize="small" />
              </Button>
            </Box>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}
