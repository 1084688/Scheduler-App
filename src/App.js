import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import Navbar from './components/Navbar';
import GlobalNotepad from './components/GlobalNotepad';
import AIAssistant from './components/AIAssistant';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import CompletedProjects from './pages/CompletedProjects';
import TrashBin from './pages/TrashBin';
import AnoAI from './components/ui/animated-shader-background';
import './App.css';
import TaskTemplates from './pages/TaskTemplates';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notepadOpen, setNotepadOpen] = useState(false);

  const hasBottomNav = currentPage === 'details' || currentPage === 'create';

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedProjects = localStorage.getItem('projects');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.error("Failed to load data", e);
      setProjects([]);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('dashboard');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addProject = (project) => {
    const newProject = { ...project, id: Date.now(), status: 'active', createdDate: new Date().toISOString() };
    const updatedProjects = [...(projects || []), newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setCurrentPage('dashboard');
  };

  const updateProject = (projectId, updatedProject) => {
    const updatedProjects = (projects || []).map(p =>
      p.id === projectId ? updatedProject : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(updatedProject);
    }
  };

  const moveToTrash = (projectId) => {
    const updatedProjects = (projects || []).map(p =>
      p.id === projectId ? { ...p, status: 'trash', deletedDate: new Date().toISOString() } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const restoreFromTrash = (projectId) => {
    const project = (projects || []).find(p => p.id === projectId);
    if (!project) return;
    const wasCompleted = project.completedDate;
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, status: wasCompleted ? 'completed' : 'active', deletedDate: null } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const permanentlyDelete = (projectId) => {
    const updatedProjects = (projects || []).filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const markProjectComplete = (projectId) => {
    const updatedProjects = (projects || []).map(p =>
      p.id === projectId ? { ...p, status: 'completed', completedDate: new Date().toISOString() } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const activeProjects = (projects || []).filter(p => p.status === 'active');
  const completedProjects = (projects || []).filter(p => p.status === 'completed');
  const trashedProjects = (projects || []).filter(p => p.status === 'trash');

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
           <AnoAI />
        </div>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        
        {/* GLOBAL BACKGROUND - FIXED */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
           <AnoAI />
        </div>

        <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Navbar 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            trashCount={trashedProjects.length}
          />

          <Box sx={{ pt: 4, px: 2, pb: hasBottomNav ? 12 : 4, maxWidth: 1600, mx: 'auto' }}>
            {currentPage === 'dashboard' && (
              <Dashboard 
                projects={activeProjects} 
                completedCount={completedProjects.length}
                
                // --- CRITICAL FIX: Passing required props for navigation ---
                setSelectedProject={setSelectedProject} 
                setCurrentPage={setCurrentPage}
                // -----------------------------------------------------------
                
                onDeleteProject={moveToTrash}
                allProjects={projects || []}
              />
            )}
            {currentPage === 'templates' &&(
             <TaskTemplates setCurrentPage={setCurrentPage} />)}

            {currentPage === 'calendar' && (
              <Calendar projects={activeProjects} />
            )}

            {currentPage === 'create' && (
              <CreateProject 
                onAddProject={addProject} 
                setCurrentPage={setCurrentPage} 
              />
            )}

            {currentPage === 'details' && selectedProject && (
  <ProjectDetails 
    project={selectedProject} 
    onBack={() => setCurrentPage('dashboard')}
    onUpdateProject={updateProject}
    onDeleteProject={moveToTrash}
    onMarkComplete={markProjectComplete}
    // ADD THIS LINE:
    setCurrentPage={setCurrentPage} 
  />
)}


            {currentPage === 'completed' && (
              <CompletedProjects 
                projects={completedProjects}
                onRestore={(id) => {
                   const p = projects.find(proj => proj.id === id);
                   updateProject(id, { ...p, status: 'active', completedDate: null });
                }}
                onDelete={moveToTrash}
              />
            )}

            {currentPage === 'trash' && (
              <TrashBin 
                projects={trashedProjects}
                onRestore={restoreFromTrash}
                onDeleteForever={permanentlyDelete}
              />
            )}
          </Box>

          <GlobalNotepad 
            isOpen={notepadOpen} 
            onToggle={setNotepadOpen} 
            hasBottomNav={hasBottomNav} 
          />
          
          <AIAssistant 
            onCreateProject={addProject}
            hasBottomNav={hasBottomNav}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
