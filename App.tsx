import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import { User, UserRole, Project } from './types';
import { MOCK_USERS, MOCK_PROJECTS } from './constants';
import DashboardStudent from './components/DashboardStudent';
import DashboardFaculty from './components/DashboardFaculty';
import Showcase from './components/Showcase';
import DashboardAdmin from './components/DashboardAdmin';
import { ToastProvider } from './components/ToastContext';

type ViewState = 'dashboard' | 'showcase';

const App: React.FC = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  // Reset view when user changes (e.g. login/logout)
  useEffect(() => {
    if (currentUser?.role === UserRole.PUBLIC) {
      setCurrentView('showcase');
    } else {
      setCurrentView('dashboard');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
  };

  const handleRoleSwitch = (role: UserRole) => {
    if (role === UserRole.FACULTY && currentUser?.role === UserRole.FACULTY) {
        // Toggle between CS and Arch faculty for demo purposes
        const nextFaculty = currentUser.departmentId === 'dept-cs' 
            ? MOCK_USERS.find(u => u.id === 'u-fac-arch') 
            : MOCK_USERS.find(u => u.id === 'u-fac-cs');
        if (nextFaculty) setCurrentUser(nextFaculty);
        return;
    }

    const user = MOCK_USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? { ...updatedProject, lastUpdated: new Date().toISOString() } : p));
  };
  
  const handleDeleteProject = (projectId: string) => {
      setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleEndorse = (projectId: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
            return { ...p, endorsements: (p.endorsements || 0) + 1 };
        }
        return p;
    }));
  };

  if (!currentUser) {
      return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    // Public always sees showcase
    if (currentUser.role === UserRole.PUBLIC) {
        return <Showcase projects={projects} userRole={currentUser.role} onEndorse={handleEndorse} />;
    }

    // Authenticated users can switch views
    if (currentView === 'showcase') {
        return <Showcase projects={projects} userRole={currentUser.role} onEndorse={handleEndorse} />;
    }

    // Dashboard Views
    switch (currentUser.role) {
      case UserRole.STUDENT:
        return (
          <DashboardStudent 
            user={currentUser} 
            projects={projects} 
            setProjects={setProjects} 
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onEndorse={handleEndorse} 
          />
        );
      case UserRole.FACULTY:
        return (
          <DashboardFaculty 
            user={currentUser} 
            projects={projects} 
            setProjects={setProjects} 
            onUpdateProject={handleUpdateProject}
            onEndorse={handleEndorse} 
          />
        );
      case UserRole.ADMIN:
        return <DashboardAdmin user={currentUser} projects={projects} />;
      default:
        return <Showcase projects={projects} userRole={currentUser.role} onEndorse={handleEndorse} />;
    }
  };

  return (
    <ToastProvider>
        <Layout 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onRoleSwitch={handleRoleSwitch}
          onUpdateUser={handleUpdateUser}
          currentView={currentView}
          onNavigate={setCurrentView}
        >
          {renderContent()}
        </Layout>
    </ToastProvider>
  );
};

export default App;