import React, { useMemo, useState } from 'react';
import { Project, User, ProjectStatus } from '../types';
import ProjectCard from './ProjectCard';
import { CheckSquare, Layers, Zap } from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';
import { useToast } from './ToastContext';

interface DashboardFacultyProps {
  user: User;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onUpdateProject: (project: Project) => void;
  onEndorse: (id: string) => void;
}

const DashboardFaculty: React.FC<DashboardFacultyProps> = ({ user, projects, setProjects, onUpdateProject, onEndorse }) => {
  const { showToast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const facultyProjects = useMemo(() => {
    return projects.filter(p => p.departmentId === user.departmentId);
  }, [projects, user.departmentId]);

  const pendingCount = facultyProjects.filter(p => p.status === ProjectStatus.SUBMITTED).length;
  const approvedCount = facultyProjects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED).length;

  // These local handlers are kept for Card-level quick actions, using the unified handler underneath
  const handleApprove = (id: string) => {
    const project = projects.find(p => p.id === id);
    if(project) {
        const updatedMembers = project.members.map(m => ({...m, validated: true}));
        onUpdateProject({ ...project, status: ProjectStatus.APPROVED, members: updatedMembers });
        setSelectedProject(null);
        showToast("Project Approved & Signals Verified", "success");
    }
  };

  const handleReject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if(project) {
        onUpdateProject({ ...project, status: ProjectStatus.REJECTED });
        setSelectedProject(null);
        showToast("Project Returned for Revision", "info");
    }
  };

  const handleFeature = (id: string) => {
     const project = projects.find(p => p.id === id);
     if(project) {
        onUpdateProject({ ...project, status: ProjectStatus.FEATURED });
        setSelectedProject(null);
        showToast("Project added to Hall of Fame", "success");
     }
  };

  const handleValidateMember = (projectId: string, memberId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const updatedMembers = project.members.map(m => {
            if (m.id === memberId) return { ...m, validated: !m.validated };
            return m;
        });
        const updatedProject = { ...project, members: updatedMembers };
        onUpdateProject(updatedProject);
        
        // Update local selection if modal is open
        if (selectedProject && selectedProject.id === projectId) {
             setSelectedProject(updatedProject);
        }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 pb-6 border-b lg:flex-row lg:items-end border-slate-200/60">
        <div><h1 className="mb-2 text-4xl font-black tracking-tight text-slate-800">Faculty Dashboard</h1><p className="text-lg font-medium text-slate-500">Overview of {user.departmentId?.replace('dept-', '').toUpperCase()} department submissions.</p></div>
        <div className="flex gap-4">
           <div className="flex items-center bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 min-w-[180px]"><div className="p-3 mr-4 rounded-xl bg-amber-100 text-amber-600"><CheckSquare className="w-6 h-6" /></div><div className="flex flex-col"><span className="text-3xl font-extrabold leading-none text-slate-800">{pendingCount}</span><span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pending Review</span></div></div>
           <div className="flex items-center bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 min-w-[180px]"><div className="p-3 mr-4 rounded-xl bg-emerald-100 text-emerald-600"><Zap className="w-6 h-6" /></div><div className="flex flex-col"><span className="text-3xl font-extrabold leading-none text-slate-800">{approvedCount}</span><span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Approved</span></div></div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center mb-6"><div className="bg-amber-100 p-1.5 rounded-lg mr-3"><CheckSquare className="w-5 h-5 text-amber-600" /></div><h2 className="text-2xl font-bold text-slate-800">Pending Approval</h2></div>
          {facultyProjects.filter(p => p.status === ProjectStatus.SUBMITTED).length === 0 ? (
             <div className="p-12 text-center bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-3xl"><h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3></div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {facultyProjects.filter(p => p.status === ProjectStatus.SUBMITTED).map(project => (
                  <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                    <ProjectCard project={project} userRole={user.role} showAdminControls={true} onApprove={(e) => { e?.stopPropagation(); handleApprove(project.id); }} onReject={(e) => { e?.stopPropagation(); handleReject(project.id); }} onEndorse={onEndorse} />
                  </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center mb-6"><div className="bg-emerald-100 p-1.5 rounded-lg mr-3"><Layers className="w-5 h-5 text-emerald-600" /></div><h2 className="text-2xl font-bold text-slate-800">Department Portfolio</h2></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {facultyProjects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED || p.status === ProjectStatus.REJECTED).map(project => (
                <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                    <ProjectCard project={project} userRole={user.role} showAdminControls={true} onFeature={(e) => { e?.stopPropagation(); handleFeature(project.id); }} onEndorse={onEndorse} />
                </div>
            ))}
          </div>
        </section>
      </div>

      {selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject} 
            userRole={user.role} 
            onClose={() => setSelectedProject(null)} 
            onApprove={handleApprove} 
            onReject={handleReject} 
            onFeature={handleFeature} 
            onValidateMember={handleValidateMember} 
            onEndorse={onEndorse}
            onUpdateProject={onUpdateProject} // Pass down for grading/comments
        />
      )}
    </div>
  );
};

export default DashboardFaculty;