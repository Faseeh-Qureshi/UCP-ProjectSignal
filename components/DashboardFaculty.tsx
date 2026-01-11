import React, { useMemo, useState } from 'react';
import { Project, User, ProjectStatus } from '../types';
import ProjectCard from './ProjectCard';
import { CheckSquare, Filter, Layers, Zap } from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';

interface DashboardFacultyProps {
  user: User;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const DashboardFaculty: React.FC<DashboardFacultyProps> = ({ user, projects, setProjects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Faculty sees projects in their department
  const facultyProjects = useMemo(() => {
    return projects.filter(p => p.departmentId === user.departmentId);
  }, [projects, user.departmentId]);

  const pendingCount = facultyProjects.filter(p => p.status === ProjectStatus.SUBMITTED).length;
  const approvedCount = facultyProjects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED).length;

  const handleApprove = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        // We do NOT auto-validate members anymore, faculty must do it manually in the modal
        // or we could assume approval means all valid, but granular is better for spec.
        // For UX smoothness, we'll validate all if they hit "Approve" on the main card,
        // but the Modal allows specific toggling.
        const updatedMembers = p.members.map(m => ({...m, validated: true}));
        return { ...p, status: ProjectStatus.APPROVED, members: updatedMembers };
      }
      return p;
    }));
    setSelectedProject(null);
  };

  const handleReject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: ProjectStatus.REJECTED } : p));
    setSelectedProject(null);
  };

  const handleFeature = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: ProjectStatus.FEATURED } : p));
    setSelectedProject(null);
  };

  const handleValidateMember = (projectId: string, memberId: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id !== projectId) return p;
        const updatedMembers = p.members.map(m => {
            if (m.id === memberId) return { ...m, validated: !m.validated };
            return m;
        });
        // Update local selected project too so modal updates instantly
        if (selectedProject && selectedProject.id === projectId) {
             setSelectedProject({ ...p, members: updatedMembers });
        }
        return { ...p, members: updatedMembers };
    }));
  };

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col justify-between gap-6 pb-6 border-b lg:flex-row lg:items-end border-slate-200/60">
        <div>
          <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-800">Faculty Dashboard</h1>
          <p className="text-lg font-medium text-slate-500">Overview of {user.departmentId?.replace('dept-', '').toUpperCase()} department submissions.</p>
        </div>
        
        <div className="flex gap-4">
           {/* Stat Card 1 */}
           <div className="flex items-center bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 min-w-[180px] transform hover:-translate-y-1 transition-transform">
              <div className="p-3 mr-4 rounded-xl bg-amber-100 text-amber-600">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                  <span className="text-3xl font-extrabold leading-none text-slate-800">{pendingCount}</span>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pending Review</span>
              </div>
           </div>
           
           {/* Stat Card 2 */}
           <div className="flex items-center bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 min-w-[180px] transform hover:-translate-y-1 transition-transform">
              <div className="p-3 mr-4 rounded-xl bg-emerald-100 text-emerald-600">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                  <span className="text-3xl font-extrabold leading-none text-slate-800">{approvedCount}</span>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Approved</span>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Pending Section */}
        <section>
          <div className="flex items-center mb-6">
            <div className="bg-amber-100 p-1.5 rounded-lg mr-3">
               <CheckSquare className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Pending Approval</h2>
          </div>
          
          {facultyProjects.filter(p => p.status === ProjectStatus.SUBMITTED).length === 0 ? (
             <div className="p-12 text-center bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-3xl">
                 <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-inner bg-slate-50">
                    <CheckSquare className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
                 <p className="font-medium text-slate-500">No pending projects require your attention at this moment.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {facultyProjects
                .filter(p => p.status === ProjectStatus.SUBMITTED)
                .map(project => (
                  <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                    <ProjectCard 
                        project={project} 
                        userRole={user.role}
                        showAdminControls={true}
                        onApprove={(e) => { e?.stopPropagation(); handleApprove(project.id); }}
                        onReject={(e) => { e?.stopPropagation(); handleReject(project.id); }}
                    />
                  </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved Section */}
        <section>
          <div className="flex items-center mb-6">
            <div className="bg-emerald-100 p-1.5 rounded-lg mr-3">
               <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Department Portfolio</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {facultyProjects
              .filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED || p.status === ProjectStatus.REJECTED)
              .map(project => (
                <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                    <ProjectCard 
                        project={project} 
                        userRole={user.role}
                        showAdminControls={true} 
                        onFeature={(e) => { e?.stopPropagation(); handleFeature(project.id); }}
                    />
                </div>
            ))}
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject}
            userRole={user.role}
            onClose={() => setSelectedProject(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onFeature={handleFeature}
            onValidateMember={handleValidateMember}
        />
      )}
    </div>
  );
};

export default DashboardFaculty;