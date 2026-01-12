import React, { useState } from 'react';
import { Project, User, ProjectType, VisibilityLevel, ProjectStatus } from '../types';
import ProjectCard from './ProjectCard';
import ProjectDetailsModal from './ProjectDetailsModal';
import { PlusCircle, Upload, X, Sparkles, LayoutGrid, Calendar, Hash, Send, Eye, EyeOff, Briefcase, Github, Lock, Globe, Scale, Building2, UserCheck, Database, FileText, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useToast } from './ToastContext';

interface DashboardStudentProps {
  user: User;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onEndorse: (id: string) => void;
}

const DashboardStudent: React.FC<DashboardStudentProps> = ({ user, projects, setProjects, onUpdateProject, onDeleteProject, onEndorse }) => {
  const { showToast } = useToast();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'none'>('none');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Stats
  const myProjects = projects.filter(p => p.submittedBy === user.id);
  const totalProjects = myProjects.length;
  const approvedProjects = myProjects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED).length;
  const mySkills = new Set<string>();
  myProjects.forEach(p => { if(p.members.length > 0) p.members[0].skills.forEach(s => mySkills.add(s)); });

  // Form State
  const initialProjectState: Partial<Project> = {
    title: '', abstract: '', outcomes: '', departmentId: user.departmentId, type: ProjectType.APPLICATION, year: new Date().getFullYear(), status: ProjectStatus.SUBMITTED, members: [], artifacts: [], tags: [], endorsements: 0, gradeVisible: true,
    supervisorName: '', repositoryUrl: '', repositoryVisibility: VisibilityLevel.PRIVATE, license: 'All Rights Reserved', industryPartner: ''
  };
  const [currentProject, setCurrentProject] = useState<Partial<Project>>(initialProjectState);

  // Aux Form States
  const [currentTag, setCurrentTag] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRoll, setMemberRoll] = useState('');
  const [memberContribution, setMemberContribution] = useState('');
  const [memberSkills, setMemberSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [artifactName, setArtifactName] = useState('');
  const [artifactVisibility, setArtifactVisibility] = useState<VisibilityLevel>(VisibilityLevel.PRIVATE);

  const handleEditStart = (project: Project) => { setCurrentProject({ ...project }); setFormMode('edit'); setSelectedProject(null); setShowDeleteConfirm(false); };
  const handleCloseForm = () => { setFormMode('none'); setCurrentProject(initialProjectState); setShowDeleteConfirm(false); };
  const addTag = () => { if (currentTag && !currentProject.tags?.includes(currentTag)) { setCurrentProject(prev => ({...prev, tags: [...(prev.tags || []), currentTag]})); setCurrentTag(''); } };
  const removeTag = (tag: string) => setCurrentProject(prev => ({...prev, tags: prev.tags?.filter(t => t !== tag)}));
  const addSkill = () => { if (currentSkill && !memberSkills.includes(currentSkill)) { setMemberSkills(prev => [...prev, currentSkill]); setCurrentSkill(''); } };
  const removeSkill = (skill: string) => setMemberSkills(prev => prev.filter(s => s !== skill));

  const handleAddMember = () => {
    if (!memberName) { showToast("Member name is required", "error"); return; }
    const member = { id: `m-${Date.now()}`, name: memberName, rollNumber: memberRoll || 'N/A', contribution: memberContribution || 'Team Member', skills: memberSkills, validated: false };
    setCurrentProject(prev => ({ ...prev, members: [...(prev.members || []), member] }));
    setMemberName(''); setMemberRoll(''); setMemberContribution(''); setMemberSkills([]);
    showToast("Team member added", "success");
  };

  const handleAddArtifact = () => {
    if (!artifactName) { showToast("Artifact name is required", "error"); return; }
    const artifact = { id: `art-${Date.now()}`, fileName: artifactName, fileType: 'pdf', visibility: artifactVisibility, url: '#' };
    setCurrentProject(prev => ({ ...prev, artifacts: [...(prev.artifacts || []), artifact] }));
    setArtifactName('');
    showToast("Artifact attached", "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject.title || !currentProject.abstract) { showToast("Please fill in required fields", "error"); return; }
    
    if (formMode === 'create') {
        const finalProject: Project = { ...currentProject as Project, id: `proj-${Date.now()}`, submittedBy: user.id, departmentId: user.departmentId || 'dept-cs', lastUpdated: new Date().toISOString() };
        setProjects(prev => [finalProject, ...prev]);
        showToast("Project submitted successfully for Faculty Review!", "success");
    } else if (formMode === 'edit' && currentProject.id) {
        onUpdateProject(currentProject as Project);
        showToast("Project details updated successfully!", "success");
    }
    handleCloseForm();
  };
  
  const handleConfirmDelete = () => {
      if (currentProject.id) {
          onDeleteProject(currentProject.id);
          showToast("Project deleted permanently.", "info");
          handleCloseForm();
      }
  };

  // Helper for dynamic labels
  const getRepoLabel = () => {
      const type = currentProject.type || ProjectType.APPLICATION;
      if(type === ProjectType.FINANCE || type === ProjectType.STRATEGY) return "Financial/Data Repository Link";
      if(type === ProjectType.DESIGN || type === ProjectType.MEDIA) return "Design/Media Assets Link";
      return "Source Code Repository";
  };
  const RepoIcon = (currentProject.type === ProjectType.FINANCE || currentProject.type === ProjectType.STRATEGY) ? Database : Github;

  if (formMode !== 'none') {
    return (
      <div className="relative max-w-5xl mx-auto overflow-hidden shadow-2xl bg-white rounded-[2rem] border border-slate-200 animate-fade-in-up mb-10">
        <div className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-ucp-navy p-3 rounded-xl shadow-lg shadow-ucp-navy/20">
                <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 font-display">
                  {formMode === 'create' ? 'New Submission' : 'Edit Project'}
              </h2>
              <p className="hidden sm:block text-sm font-bold text-slate-400">
                  {formMode === 'create' ? 'Formalize your academic output.' : 'Update details & governance.'}
              </p>
            </div>
          </div>
          <button onClick={handleCloseForm} className="p-2 transition-all rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50"><X className="w-6 h-6" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-12 bg-white">
          
          {/* Section 1: Essentials */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-black tracking-widest uppercase text-ucp-crimson gap-3">
                     <span className="w-7 h-7 rounded-lg bg-red-50 text-ucp-crimson flex items-center justify-center text-xs border border-red-100">01</span>
                     Project Essentials
                 </h3>
                 <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Grade Visibility</span>
                     <button type="button" onClick={() => setCurrentProject(p => ({...p, gradeVisible: !p.gradeVisible}))} className={`p-1.5 rounded-md border transition-all ${currentProject.gradeVisible ? 'bg-white text-indigo-600 border-indigo-200 shadow-sm' : 'bg-slate-200 text-slate-400 border-transparent'}`}>
                        {currentProject.gradeVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                     </button>
                 </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Title <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. Autonomous Drone Delivery System" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold focus:bg-white focus:border-ucp-navy focus:ring-4 focus:ring-ucp-navy/10 outline-none placeholder:text-slate-400 transition-all text-sm" value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <div className="relative">
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold appearance-none cursor-pointer focus:bg-white focus:border-ucp-navy outline-none text-sm" value={currentProject.type} onChange={e => setCurrentProject({...currentProject, type: e.target.value as ProjectType})}>
                    {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <LayoutGrid className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Academic Year</label>
                  <div className="relative">
                    <input type="number" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold focus:bg-white focus:border-ucp-navy outline-none text-sm" value={currentProject.year} onChange={e => setCurrentProject({...currentProject, year: parseInt(e.target.value)})} />
                    <Calendar className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                  </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Abstract <span className="text-red-500">*</span></label>
                <textarea required rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-medium resize-none focus:bg-white focus:border-ucp-navy focus:ring-4 focus:ring-ucp-navy/10 outline-none placeholder:text-slate-400 text-sm leading-relaxed" value={currentProject.abstract} onChange={e => setCurrentProject({...currentProject, abstract: e.target.value})} placeholder="Provide a concise summary of the problem, methodology, and key results..." />
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Outcomes & Deliverables</label>
                <textarea required rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-medium resize-none focus:bg-white focus:border-ucp-navy focus:ring-4 focus:ring-ucp-navy/10 outline-none placeholder:text-slate-400 text-sm leading-relaxed" value={currentProject.outcomes} onChange={e => setCurrentProject({...currentProject, outcomes: e.target.value})} placeholder="List tangible outputs (e.g., prototype, dataset, research paper)." />
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-2">
                 <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Tags</label>
                 <div className="flex flex-wrap items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 focus-within:bg-white focus-within:border-ucp-navy focus-within:ring-4 focus-within:ring-ucp-navy/5 transition-all min-h-[50px]">
                    {currentProject.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                            <Hash className="w-3 h-3 text-indigo-400" />{tag}<X onClick={() => removeTag(tag)} className="w-3 h-3 cursor-pointer hover:text-indigo-900"/>
                        </span>
                    ))}
                    <input type="text" placeholder={currentProject.tags?.length === 0 ? "Type tag & press Enter..." : ""} className="flex-1 min-w-[150px] outline-none text-sm bg-transparent font-medium text-slate-800 placeholder:text-slate-400" value={currentTag} onChange={e => setCurrentTag(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addTag(); }}} />
                 </div>
              </div>
            </div>
          </section>

          {/* Section 2: Governance */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-black tracking-widest uppercase text-ucp-crimson gap-3">
                     <span className="w-7 h-7 rounded-lg bg-red-50 text-ucp-crimson flex items-center justify-center text-xs border border-red-100">02</span>
                     Governance & IP
                 </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faculty Supervisor</label>
                    <div className="relative">
                        <input type="text" placeholder="Search Directory..." className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold focus:bg-white focus:border-ucp-navy outline-none placeholder:text-slate-400 text-sm" value={currentProject.supervisorName} onChange={e => setCurrentProject({...currentProject, supervisorName: e.target.value})} />
                        <UserCheck className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Industry Partner</label>
                    <div className="relative">
                        <input type="text" placeholder="e.g. Google" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold focus:bg-white focus:border-ucp-navy outline-none placeholder:text-slate-400 text-sm" value={currentProject.industryPartner} onChange={e => setCurrentProject({...currentProject, industryPartner: e.target.value})} />
                        <Building2 className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">{getRepoLabel()}</label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <input type="text" placeholder="https://github.com/..." className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold focus:bg-white focus:border-ucp-navy outline-none placeholder:text-slate-400 text-sm" value={currentProject.repositoryUrl} onChange={e => setCurrentProject({...currentProject, repositoryUrl: e.target.value})} />
                            <RepoIcon className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <select className="w-40 rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 cursor-pointer outline-none focus:border-ucp-navy" value={currentProject.repositoryVisibility} onChange={e => setCurrentProject({...currentProject, repositoryVisibility: e.target.value as VisibilityLevel})}>
                            <option value={VisibilityLevel.PRIVATE}>Private</option>
                            <option value={VisibilityLevel.PUBLIC}>Public</option>
                            <option value={VisibilityLevel.DEPARTMENT}>Dept Only</option>
                        </select>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Licensing Model</label>
                    <div className="relative">
                        <select className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 font-bold cursor-pointer appearance-none focus:bg-white focus:border-ucp-navy outline-none text-sm" value={currentProject.license} onChange={e => setCurrentProject({...currentProject, license: e.target.value})}>
                            <option value="All Rights Reserved">All Rights Reserved (Standard)</option>
                            <option value="MIT License">MIT License (Open Source)</option>
                            <option value="GNU GPLv3">GNU GPLv3</option>
                            <option value="Apache 2.0">Apache 2.0</option>
                            <option value="Creative Commons BY-NC">Creative Commons BY-NC</option>
                            <option value="University Proprietary">University Proprietary (Patent Pending)</option>
                        </select>
                        <Scale className="absolute w-4 h-4 -translate-y-1/2 right-4 top-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
          </section>

          {/* Section 3: Team & Artifacts */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 pt-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-black tracking-widest uppercase text-ucp-crimson gap-3">
                     <span className="w-7 h-7 rounded-lg bg-red-50 text-ucp-crimson flex items-center justify-center text-xs border border-red-100">03</span>
                     Team Roster
                 </h3>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Name" className="rounded-xl border border-slate-200 bg-white p-3 text-sm w-full outline-none focus:border-ucp-navy text-slate-800 placeholder:text-slate-400 font-bold" value={memberName} onChange={e => setMemberName(e.target.value)} />
                    <input placeholder="Roll No" className="rounded-xl border border-slate-200 bg-white p-3 text-sm w-full outline-none focus:border-ucp-navy text-slate-800 placeholder:text-slate-400 font-bold" value={memberRoll} onChange={e => setMemberRoll(e.target.value)} />
                 </div>
                 <input placeholder="Role (e.g. Lead Developer)" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-ucp-navy text-slate-800 placeholder:text-slate-400 font-bold" value={memberContribution} onChange={e => setMemberContribution(e.target.value)} />
                 
                 <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl bg-white focus-within:border-ucp-navy min-h-[46px]">
                    {memberSkills.map(s => (
                        <span key={s} className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-bold">{s} <X onClick={() => removeSkill(s)} className="w-3 h-3 cursor-pointer"/></span>
                    ))}
                    <input placeholder="Add Skills..." className="flex-1 min-w-[80px] text-xs outline-none bg-transparent font-bold text-slate-800 placeholder:text-slate-400" value={currentSkill} onChange={e => setCurrentSkill(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addSkill(); }}} />
                 </div>
                 
                 <button type="button" onClick={handleAddMember} className="w-full py-3 text-xs font-black uppercase tracking-wider text-white transition-colors bg-slate-800 rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-900/10">Add Member</button>
              </div>
              <div className="space-y-3">
                {currentProject.members?.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                    <div>
                        <div className="font-bold text-slate-800 text-sm">{m.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.contribution}</div>
                    </div>
                    <div className="flex gap-1">
                        {m.skills.slice(0, 3).map(s => <div key={s} className="w-2 h-2 rounded-full bg-indigo-400"></div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

             <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <h3 className="flex items-center text-sm font-black tracking-widest uppercase text-ucp-crimson gap-3">
                     <span className="w-7 h-7 rounded-lg bg-red-50 text-ucp-crimson flex items-center justify-center text-xs border border-red-100">04</span>
                     Artifacts
                 </h3>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex flex-col gap-4">
                  <input placeholder="File Name (e.g. Final Report)" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-ucp-navy text-slate-800 placeholder:text-slate-400 font-bold" value={artifactName} onChange={e => setArtifactName(e.target.value)} />
                  <div className="flex gap-3">
                    <select className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none cursor-pointer focus:border-ucp-navy text-slate-800 font-bold" value={artifactVisibility} onChange={e => setArtifactVisibility(e.target.value as VisibilityLevel)}>
                        {Object.values(VisibilityLevel).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <button type="button" onClick={handleAddArtifact} className="px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-slate-800 rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-900/10">Attach</button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                  {currentProject.artifacts?.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Upload className="w-4 h-4"/></div>
                          <span className="font-bold text-slate-700 text-sm">{a.fileName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase border border-slate-100 px-2 py-1 rounded">{a.visibility}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
             {formMode === 'edit' && (
                <div className="w-full sm:w-auto">
                    {showDeleteConfirm ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 p-2 bg-rose-50 rounded-xl border border-rose-100">
                            <span className="text-xs font-bold text-rose-700 px-2">Confirm Deletion?</span>
                            <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">Yes</button>
                            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors shadow-sm">No</button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-rose-600 hover:text-rose-800 text-xs font-bold px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200">
                            <Trash2 className="w-4 h-4" /> Delete Project
                        </button>
                    )}
                </div>
             )}
            <button type="submit" className="w-full sm:w-auto px-12 py-4 text-lg font-bold text-white bg-ucp-crimson rounded-2xl shadow-xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-red-900/20 ml-auto flex items-center justify-center gap-3">
                <Check className="w-6 h-6" /> {formMode === 'create' ? 'Submit for Review' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="space-y-12 pb-12">
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-xl shadow-slate-200/50 group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8 w-full">
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ucp-navy to-ucp-crimson p-[3px] shadow-lg">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white overflow-hidden">
                             {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-3xl font-black text-ucp-navy font-display">{user.name.charAt(0)}</span>
                             )}
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">{user.name}</h1>
                    <p className="text-slate-500 font-medium flex items-center mb-4"><Briefcase className="w-4 h-4 mr-1.5 text-ucp-crimson" />{user.departmentId?.replace('dept-', '').toUpperCase()} Department</p>
                    <div className="flex flex-wrap gap-2">{Array.from(mySkills).slice(0, 5).map((skill, i) => (<span key={i} className="px-3 py-1 rounded-lg bg-white text-slate-600 text-xs font-bold border border-slate-200">{skill}</span>))}</div>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm min-w-[140px]"><span className="text-3xl font-black text-slate-800">{totalProjects}</span><span className="text-[10px] font-bold text-slate-400 uppercase">Submissions</span></div>
                <div className="flex flex-col items-center justify-center px-8 py-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm min-w-[140px]"><span className="text-3xl font-black text-indigo-600">{approvedProjects}</span><span className="text-[10px] font-bold text-indigo-400 uppercase">Verified</span></div>
            </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end pb-4 border-b border-slate-200/60">
        <div><h2 className="text-2xl font-bold text-slate-800 font-display">My Project Portfolio</h2><p className="text-slate-500 font-medium">Manage your submissions and view faculty feedback.</p></div>
        <button onClick={() => setFormMode('create')} className="flex items-center px-6 py-3 font-bold text-white bg-ucp-navy shadow-lg rounded-xl hover:bg-slate-800 transition-all shadow-slate-900/20 active:scale-95"><PlusCircle className="w-5 h-5 mr-2" />Start New Submission</button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Card (Empty State) */}
        {myProjects.length === 0 && (
            <div 
                onClick={() => setFormMode('create')}
                className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-ucp-navy hover:bg-slate-50 transition-all group"
            >
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-ucp-navy group-hover:text-white transition-colors">
                    <PlusCircle className="w-8 h-8 text-slate-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-600">No Projects Yet</h3>
                <p className="text-sm text-slate-400">Click to start your first submission</p>
            </div>
        )}

        {myProjects.map(project => (
            <div key={project.id} className="relative group/item cursor-pointer">
                <div onClick={() => setSelectedProject(project)}>
                    <ProjectCard project={project} userRole={user.role} onEndorse={onEndorse} />
                </div>
                {project.status === ProjectStatus.APPROVED && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); showToast("Endorsement requests sent!", "success"); }}
                        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md text-indigo-600 p-2 rounded-full border border-indigo-100 shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity hover:scale-110"
                        title="Request External Endorsement"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                )}
            </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject} 
            userRole={user.role} 
            onClose={() => setSelectedProject(null)} 
            onEndorse={onEndorse}
            onEdit={() => handleEditStart(selectedProject)}
        />
      )}
    </div>
  );
};

export default DashboardStudent;