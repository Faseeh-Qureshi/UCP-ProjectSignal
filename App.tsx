import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import { User, UserRole, Project } from './types';
import { MOCK_USERS, MOCK_PROJECTS } from './constants';
import DashboardStudent from './components/DashboardStudent';
import DashboardFaculty from './components/DashboardFaculty';
import Showcase from './components/Showcase';
import DashboardAdmin from './components/DashboardAdmin';

const App: React.FC = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Special Demo Logic: Allow switching specific faculty users for the demo
  const handleRoleSwitch = (role: UserRole) => {
    // If we are already logged in, we want to simulate viewing as different roles
    // OR if we are Faculty, toggle between CS and Architecture
    if (role === UserRole.FACULTY && currentUser?.role === UserRole.FACULTY) {
        // Toggle between CS and Architecture Faculty
        const nextFaculty = currentUser.departmentId === 'dept-cs' 
            ? MOCK_USERS.find(u => u.id === 'u-fac-arch') 
            : MOCK_USERS.find(u => u.id === 'u-fac-cs');
        if (nextFaculty) setCurrentUser(nextFaculty);
        return;
    }

    const user = MOCK_USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  if (!currentUser) {
      return <Login onLogin={setCurrentUser} />;
  }

  // Render content based on Role
  const renderContent = () => {
    switch (currentUser.role) {
      case UserRole.STUDENT:
        return <DashboardStudent user={currentUser} projects={projects} setProjects={setProjects} />;
      
      case UserRole.FACULTY:
        return <DashboardFaculty user={currentUser} projects={projects} setProjects={setProjects} />;
      
      case UserRole.ADMIN:
        return <DashboardAdmin user={currentUser} projects={projects} />;
      
      case UserRole.PUBLIC:
      default:
        return <Showcase projects={projects} userRole={currentUser.role} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      onLogout={handleLogout} 
      onRoleSwitch={handleRoleSwitch}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;