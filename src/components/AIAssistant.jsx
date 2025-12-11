import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Fab, Paper, TextField, Button, Typography, 
  Chip, CircularProgress, IconButton
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OPENAI_API_KEY = 'sk-proj-YOUR_API_KEY_HERE';

export default function AIAssistant({ onCreateProject, hasBottomNav }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const aiPanelRef = useRef(null);

  // Dark Input Style
  const darkInputStyle = {
    '& .MuiOutlinedInput-root': { 
      bgcolor: 'rgba(30, 41, 59, 0.5)', 
      color: 'white'
    },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiPanelRef.current && !aiPanelRef.current.contains(event.target) && open) {
        const fabButton = document.querySelector('[data-ai-fab]');
        if (!fabButton || !fabButton.contains(event.target)) {
          setOpen(false);
        }
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm your AI project assistant. Tell me about your project and I'll help you create it with tasks, deadlines, and costs. For example: 'I need to build a website for $10,000, deadline in 3 months with 5 development phases'"
      }]);
    }
  };

  const callOpenAI = async (conversationHistory) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a project management assistant. Help users create projects with tasks, deadlines, and costs. When user provides project details, respond in this EXACT JSON format:
{
  "type": "project_data",
  "project": {
    "name": "Project Name",
    "description": "Description",
    "deadline": "2026-12-31",
    "projectWorth": 50000,
    "profitPercentage": 30,
    "myProfit": 15000,
    "notes": "",
    "tasks": [
      {
        "name": "Task 1",
        "deadline": "2026-03-15",
        "payment": 5000,
        "expenses": 1000
      }
    ]
  }
}

If you need more information, ask questions conversationally. Only output JSON when you have ALL required info: project name, total worth, deadline, and at least one task with payment info.`
          },
          ...conversationHistory
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await callOpenAI(newMessages);
      
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.type === 'project_data') {
          setMessages([...newMessages, {
            role: 'assistant',
            content: 'Great! I\'ve prepared your project. Review the details below:',
            projectData: parsed.project
          }]);
        } else {
          setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
        }
      } catch (e) {
        setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
      }
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure the AI service is properly configured.' 
      }]);
    }

    setLoading(false);
  };

  const handleCreateFromAI = (projectData) => {
    const formattedProject = {
      ...projectData,
      subTasks: projectData.tasks.map((task, idx) => ({
        id: Date.now() + idx,
        name: task.name,
        deadline: task.deadline,
        payment: task.payment || 0,
        expenses: task.expenses || 0,
        notes: '',
        completed: false,
        completedDate: null
      }))
    };
    delete formattedProject.tasks;
    
    onCreateProject(formattedProject);
    setOpen(false);
    setMessages([]);
  };

  return (
    <>
      <Fab
        data-ai-fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: hasBottomNav ? 120 : 24,
          right: 104,
          zIndex: 1200,
          display: open ? 'none' : 'flex',
          transition: 'bottom 0.3s ease-in-out'
        }}
        onClick={handleOpen}
      >
        <SmartToyIcon />
      </Fab>

      {open && (
        <Paper
          ref={aiPanelRef}
          elevation={24}
          sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: 400,
            zIndex: 1300,
            bgcolor: '#0f172a',
            borderLeft: '3px solid #22d3ee',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '2px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(15, 23, 42, 0.8)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon sx={{ color: '#22d3ee' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>AI Assistant</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* MESSAGES */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {messages.map((msg, idx) => (
              <Box key={idx}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <Paper sx={{ 
                    p: 2, 
                    maxWidth: '85%',
                    bgcolor: msg.role === 'user' ? '#22d3ee' : 'rgba(30, 41, 59, 0.6)',
                    color: 'white',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>

                {msg.projectData && (
                  <Box sx={{ mt: 2 }}>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(16, 185, 129, 0.1)', 
                      border: '2px solid #10b981',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#10b981', fontWeight: 700 }}>
                        📋 {msg.projectData.name}
                      </Typography>
                      
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                            Worth
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                            {msg.projectData.projectWorth.toLocaleString()} AED
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                            Profit
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                            {msg.projectData.myProfit.toLocaleString()} AED
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                            Deadline
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'white' }}>
                            {new Date(msg.projectData.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                            Tasks
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white' }}>{msg.projectData.tasks.length} tasks</Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                        Tasks:
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {msg.projectData.tasks.map((task, tidx) => (
                          <Chip 
                            key={tidx}
                            label={`${task.name} - ${task.payment.toLocaleString()} AED`}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: '1px solid #10b981',
                              fontSize: '0.7rem' 
                            }}
                          />
                        ))}
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleCreateFromAI(msg.projectData)}
                        sx={{ 
                          py: 1.5,
                          fontWeight: 700,
                          bgcolor: '#10b981',
                          '&:hover': { bgcolor: '#059669' }
                        }}
                      >
                        Create This Project
                      </Button>
                    </Paper>
                  </Box>
                )}
              </Box>
            ))}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(30, 41, 59, 0.6)', 
                  display: 'flex', 
                  gap: 1, 
                  alignItems: 'center', 
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <CircularProgress size={16} sx={{ color: '#22d3ee' }} />
                  <Typography variant="body2" sx={{ color: 'white' }}>AI is thinking...</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT AREA */}
          <Box sx={{ 
            p: 2, 
            borderTop: '2px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(15, 23, 42, 0.8)'
          }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#94a3b8' }}>
              Click outside or press ESC to close
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Describe your project..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                multiline
                maxRows={3}
                size="small"
                sx={darkInputStyle}
              />
              <IconButton 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                sx={{ 
                  bgcolor: '#22d3ee',
                  color: 'white',
                  '&:hover': { bgcolor: '#06b6d4' },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    color: '#64748b'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
}
