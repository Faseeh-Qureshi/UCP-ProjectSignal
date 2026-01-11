import React, { useState } from 'react';
import { Project, User, ProjectType, VisibilityLevel, ProjectStatus } from '../types';
import ProjectCard from './ProjectCard';
import ProjectDetailsModal from './ProjectDetailsModal';
import { PlusCircle, Upload, Trash2, Save, Sparkles, LayoutGrid, FileText, Calendar, X, Zap, UserPlus, FileUp, Award, Briefcase, ChevronRight, Share2 } from 'lucide-react';

interface DashboardStudentProps {
  user: User;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const DashboardStudent: React.FC<DashboardStudentProps> = ({ user, projects, setProjects }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Calculate Student Stats
  const myProjects = projects.filter(p => p.submittedBy === user.id);
  const totalProjects = myProjects.length;
  const approvedProjects = myProjects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED).length;
  
  // Flatten skills
  const mySkills = new Set<string>();
  myProjects.forEach(p => {
     if(p.members.length > 0) {
        p.members[0].skills.forEach(s => mySkills.add(s));
     }
  });


  // Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    abstract: '',
    outcomes: '',
    departmentId: user.departmentId,
    type: ProjectType.APPLICATION,
    year: new Date().getFullYear(),
    status: ProjectStatus.SUBMITTED,
    members: [],
    artifacts: []
  });

  const [memberName, setMemberName] = useState('');
  const [memberRoll, setMemberRoll] = useState('');
  const [memberContribution, setMemberContribution] = useState('');
  const [memberSkills, setMemberSkills] = useState('');
  
  const [artifactName, setArtifactName] = useState('');
  const [artifactVisibility, setArtifactVisibility] = useState<VisibilityLevel>(VisibilityLevel.PRIVATE);

  const handleAddMember = () => {
    if (!memberName) return;
    const member = {
      id: `m-${Date.now()}`,
      name: memberName,
      rollNumber: memberRoll || 'N/A',
      contribution: memberContribution || 'Team Member',
      skills: memberSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      validated: false
    };
    setNewProject(prev => ({ ...prev, members: [...(prev.members || []), member] }));
    setMemberName('');
    setMemberSkills('');
    setMemberRoll('');
    setMemberContribution('');
  };

  const handleAddArtifact = () => {
    if (!artifactName) return;
    const artifact = {
      id: `art-${Date.now()}`,
      fileName: artifactName,
      fileType: 'pdf', // Mock default
      visibility: artifactVisibility,
      url: '#'
    };
    setNewProject(prev => ({ ...prev, artifacts: [...(prev.artifacts || []), artifact] }));
    setArtifactName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProject: Project = {
      ...newProject as Project,
      id: `proj-${Date.now()}`,
      submittedBy: user.id,
      departmentId: user.departmentId || 'dept-cs'
    };
    setProjects(prev => [finalProject, ...prev]);
    setIsCreating(false);
    setNewProject({
       title: '',
        abstract: '',
        outcomes: '',
        departmentId: user.departmentId,
        type: ProjectType.APPLICATION,
        year: new Date().getFullYear(),
        status: ProjectStatus.SUBMITTED,
        members: [],
        artifacts: []
    });
  };

  if (isCreating) {
    return (
      <div className="relative max-w-5xl mx-auto overflow-hidden shadow-2xl bg-white/95 backdrop-blur-3xl rounded-[2rem] border border-white/60 animate-fade-in-up ring-1 ring-slate-900/5">
        {/* Form Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 font-display">New Project Submission</h2>
              <p className="text-sm font-bold text-slate-400">Share your innovation with the university.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreating(false)} 
            className="p-2 transition-all rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Core Info Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-bold tracking-widest uppercase text-indigo-600">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-[10px]">1</span>
                    Project Essentials
                </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-slate-700">Project Title</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Autonomous Drone Delivery System"
                  className="w-full rounded-xl border border-slate-200 bg-white focus:bg-indigo-50/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all p-3.5 text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-normal shadow-sm"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Project Type</label>
                <div className="relative">
                  <select 
                    className="w-full rounded-xl border border-slate-200 bg-white focus:bg-indigo-50/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all p-3.5 text-slate-800 font-medium appearance-none shadow-sm cursor-pointer"
                    value={newProject.type}
                    onChange={e => setNewProject({...newProject, type: e.target.value as ProjectType})}
                  >
                    {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <LayoutGrid className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Academic Year</label>
                  <div className="relative">
                    <input 
                        type="number"
                        className="w-full rounded-xl border border-slate-200 bg-white focus:bg-indigo-50/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all p-3.5 text-slate-800 font-medium shadow-sm"
                        value={newProject.year}
                        onChange={e => setNewProject({...newProject, year: parseInt(e.target.value)})}
                    />
                    <Calendar className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                  </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-slate-700">Abstract</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Provide a comprehensive summary of your project's goals and methodology..."
                  className="w-full rounded-xl border border-slate-200 bg-white focus:bg-indigo-50/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all p-3.5 text-slate-800 font-medium placeholder:text-slate-300 placeholder:font-normal shadow-sm resize-none"
                  value={newProject.abstract}
                  onChange={e => setNewProject({...newProject, abstract: e.target.value})}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-slate-700 flex items-center">
                    Outcomes & Deliverables <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Important</span>
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="What was achieved? (e.g. Functional prototype, 15% efficiency increase, published paper)"
                  className="w-full rounded-xl border border-slate-200 bg-white focus:bg-indigo-50/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all p-3.5 text-slate-800 font-medium placeholder:text-slate-300 placeholder:font-normal shadow-sm resize-none"
                  value={newProject.outcomes}
                  onChange={e => setNewProject({...newProject, outcomes: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Members & Artifacts Container */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 pt-6">
            
            {/* Members Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-bold tracking-widest uppercase text-indigo-600">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-[10px]">2</span>
                    Team Contributors
                </h3>
              </div>
              
              <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <input 
                      placeholder="Name" 
                      className="rounded-lg border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
                      value={memberName}
                      onChange={e => setMemberName(e.target.value)}
                    />
                    <input 
                      placeholder="Roll Number" 
                      className="rounded-lg border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
                      value={memberRoll}
                      onChange={e => setMemberRoll(e.target.value)}
                    />
                 </div>
                 <input 
                    placeholder="Specific Contribution (e.g. Backend API)" 
                    className="w-full mb-3 rounded-lg border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
                    value={memberContribution}
                    onChange={e => setMemberContribution(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input 
                      placeholder="Skills (comma separated)" 
                      className="flex-1 rounded-lg border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
                      value={memberSkills}
                      onChange={e => setMemberSkills(e.target.value)}
                    />
                    <button type="button" onClick={handleAddMember} className="px-4 py-2 text-sm font-bold text-white transition-colors bg-slate-800 rounded-lg hover:bg-black">Add</button>
                  </div>
              </div>

              <div className="space-y-2">
                {newProject.members?.map((m, i) => (
                  <div key={i} className="flex flex-col p-3 transition-colors bg-white border shadow-sm rounded-xl border-slate-100 group hover:border-indigo-200">
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-slate-700">{m.name} <span className="text-xs font-normal text-slate-400">({m.rollNumber})</span></span>
                       <button type="button" className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="mt-1 text-xs italic text-slate-500">"{m.contribution}"</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {m.skills.map((s, idx) => <span key={idx} className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artifacts Section */}
             <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-bold tracking-widest uppercase text-indigo-600">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 text-[10px]">3</span>
                    Artifacts & Evidence
                </h3>
              </div>
              
              <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
                <div className="flex flex-col gap-3">
                  <input 
                    placeholder="File Name (e.g. Project Report)" 
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
                    value={artifactName}
                    onChange={e => setArtifactName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 rounded-lg border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none bg-white cursor-pointer"
                      value={artifactVisibility}
                      onChange={e => setArtifactVisibility(e.target.value as VisibilityLevel)}
                    >
                        {Object.values(VisibilityLevel).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <button type="button" onClick={handleAddArtifact} className="px-4 py-2 text-sm font-bold text-white transition-colors bg-slate-800 rounded-lg hover:bg-black flex items-center justify-center gap-1"><PlusCircle className="w-4 h-4"/> Add</button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                  {newProject.artifacts?.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 transition-colors bg-white border shadow-sm rounded-xl border-slate-100 group hover:border-indigo-200">
                      <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 p-1.5 rounded-md text-indigo-500"><Upload className="w-3 h-3"/></div>
                          <span className="font-semibold text-slate-700">{a.fileName}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full">{a.visibility}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-slate-100">
            <button 
              type="submit" 
              className="flex items-center px-12 py-4 text-lg font-bold text-white transition-all transform shadow-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-2xl shadow-indigo-200 hover:-translate-y-1 hover:shadow-indigo-300 active:scale-95 border-t border-white/20"
            >
              <Save className="w-5 h-5 mr-2" />
              Submit Project
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Capability Profile Card - Updated UI */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-xl shadow-slate-200/50 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8 w-full">
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 p-[3px] shadow-lg">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white">
                            <span className="text-3xl font-black text-indigo-600 font-display">{user.name.charAt(0)}</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full"></div>
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">{user.name}</h1>
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                             Student
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center mb-4">
                        <Briefcase className="w-4 h-4 mr-1.5 text-indigo-500" />
                        {user.departmentId?.replace('dept-', '').toUpperCase()} Department
                    </p>
                    
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validated Competencies</span>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(mySkills).slice(0, 5).map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-white text-slate-600 text-xs font-bold border border-slate-200 shadow-sm">
                                    {skill}
                                </span>
                            ))}
                            {mySkills.size > 5 && <span className="px-2 py-1 text-xs text-slate-400 font-bold">+{mySkills.size - 5} more</span>}
                            {mySkills.size === 0 && <span className="text-xs italic text-slate-400">No validated skills yet. Submit a project!</span>}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 shrink-0">
                <div className="flex flex-col items-center justify-center px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm min-w-[140px]">
                    <span className="text-3xl font-black text-slate-800 font-display">{totalProjects}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Submissions</span>
                </div>
                <div className="flex flex-col items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 shadow-sm min-w-[140px]">
                    <span className="text-3xl font-black text-indigo-600 font-display">{approvedProjects}</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Verified Signals</span>
                </div>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end pb-4 border-b border-slate-200/60">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-display">My Project Portfolio</h2>
          <p className="text-slate-500 font-medium">Manage your submissions and view faculty feedback.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center px-6 py-3 font-bold text-white transition-all transform bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700 shadow-indigo-200/50 hover:-translate-y-0.5 active:scale-95"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Start New Submission
        </button>
      </div>

      {myProjects.length === 0 ? (
        <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-indigo-300 hover:bg-white/60 transition-all cursor-pointer" onClick={() => setIsCreating(true)}>
          <div className="p-6 mb-6 transition-transform duration-300 bg-white rounded-full shadow-lg shadow-slate-100 group-hover:scale-110 group-hover:rotate-3">
              <Sparkles className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-slate-800 font-display">Start Your Legacy</h3>
          <p className="max-w-md mx-auto mb-6 text-slate-500 font-medium">
              Transform your final year effort into a verified professional signal.
          </p>
          <span className="inline-flex items-center font-bold text-indigo-600 hover:underline">
              Create Submission <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {myProjects.map(project => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                <ProjectCard project={project} userRole={user.role} />
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject}
            userRole={user.role}
            onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default DashboardStudent;