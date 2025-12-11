import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TaskItemRow from './TaskItemRow'; // We'll make a tiny component for the row itself

export default function ProjectTaskList({ 
  project, 
  editingTask, 
  expandedTasks, 
  addingExpenseToTask, 
  newExpense,
  darkInputStyle,
  // Actions
  toggleTaskComplete,
  toggleTaskPayment,
  handleEditTask,
  handleSaveTaskEdit,
  handleCancelTaskEdit,
  setEditingTask,
  setNewExpense,
  handleAddExpense,
  handleRemoveExpense,
  toggleTaskExpanded,
  setAddingExpenseToTask,
  calculateTaskPayment,
  calculateTaskExpenses,
  getDeadlineColor,
  formatDate,
  differenceInDays
}) {
  return (
    <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>
          Project Tasks
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {project.subTasks?.map((task) => (
            <TaskItemRow
              key={task.id}
              task={task}
              project={project}
              isEditing={editingTask?.id === task.id}
              isExpanded={expandedTasks[task.id]}
              isAddingExpense={addingExpenseToTask === task.id}
              editingTask={editingTask}
              newExpense={newExpense}
              darkInputStyle={darkInputStyle}
              // Functions
              toggleTaskComplete={toggleTaskComplete}
              toggleTaskPayment={toggleTaskPayment}
              handleEditTask={handleEditTask}
              handleSaveTaskEdit={handleSaveTaskEdit}
              handleCancelTaskEdit={handleCancelTaskEdit}
              setEditingTask={setEditingTask}
              setNewExpense={setNewExpense}
              handleAddExpense={handleAddExpense}
              handleRemoveExpense={handleRemoveExpense}
              toggleTaskExpanded={toggleTaskExpanded}
              setAddingExpenseToTask={setAddingExpenseToTask}
              calculateTaskPayment={calculateTaskPayment}
              calculateTaskExpenses={calculateTaskExpenses}
              getDeadlineColor={getDeadlineColor}
              formatDate={formatDate}
              differenceInDays={differenceInDays}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
