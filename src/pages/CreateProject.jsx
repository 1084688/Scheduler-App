import React, { useState } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Stepper, Step, StepLabel } from '@mui/material';
import dayjs from 'dayjs';

// IMPORTANT: Ensure these two files exist in your 'src/components' folder
import ProjectForm from '../components/ProjectForm'; 
import TaskManager from '../components/TaskManager';

export default function CreateProject({ onAddProject, setCurrentPage }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Project Details', 'Tasks & Phases', 'Review'];

  // Initial State
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    deadline: dayjs().add(1, 'month').format('YYYY-MM-DD'),
    status: 'active',
    projectMode: 'awarded', // 'study' or 'awarded'
    totalBudget: '',
    myProfit: '',
    notes: '',
    subTasks: []
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    // Basic validation
    if (!projectData.name) {
      alert("Please enter a project name");
      return;
    }
    
    // Finalize data structure before saving
    const finalProject = {
      ...projectData,
      subTasks: projectData.subTasks.map(t => ({
        ...t,
        completed: false,
        paymentReceived: false,
        expenses: t.expenses || [] 
      }))
    };

    onAddProject(finalProject);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: 'white' }}>
        Create New Project
      </Typography>

      {/* STEPPER */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel 
              sx={{ 
                '& .MuiStepLabel-label': { color: '#94a3b8 !important' },
                '& .MuiStepLabel-label.Mui-active': { color: '#22d3ee !important', fontWeight: 700 },
                '& .MuiStepLabel-label.Mui-completed': { color: '#10b981 !important' }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* STEP 1: PROJECT FORM */}
      {activeStep === 0 && (
        <ProjectForm 
          projectData={projectData} 
          setProjectData={setProjectData} 
          onNext={handleNext} 
        />
      )}

      {/* STEP 2: TASK MANAGER */}
      {activeStep === 1 && (
        <TaskManager 
          projectData={projectData} 
          setProjectData={setProjectData} 
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {/* STEP 3: REVIEW */}
      {activeStep === 2 && (
        <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>Review Project</Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>PROJECT NAME</Typography>
                <Typography variant="h6" sx={{ color: 'white' }}>{projectData.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>DEADLINE</Typography>
                <Typography variant="h6" sx={{ color: 'white' }}>{projectData.deadline}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>TYPE</Typography>
                <Typography variant="h6" sx={{ color: 'white', textTransform: 'capitalize' }}>
                  {projectData.projectMode === 'awarded' ? 'Awarded Project' : 'Study / Bidding'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>TASKS</Typography>
                <Typography variant="h6" sx={{ color: 'white' }}>{projectData.subTasks.length} defined</Typography>
              </Box>
              {projectData.projectMode === 'awarded' && (
                 <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>BUDGET</Typography>
                    <Typography variant="h6" sx={{ color: '#10b981' }}>{projectData.totalBudget} AED</Typography>
                 </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleBack} sx={{ color: '#94a3b8' }}>Back</Button>
              <Button 
                variant="contained" 
                size="large" 
                onClick={handleSubmit}
                sx={{ bgcolor: '#22d3ee', '&:hover': { bgcolor: '#06b6d4' } }}
              >
                Create Project
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
