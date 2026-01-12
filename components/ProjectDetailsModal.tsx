import React, { useState } from 'react';
import { Project, UserRole, ProjectStatus, VisibilityLevel, GRADES, ProjectType, User } from '../types';
import { X, Download, Award, Zap, Share2, ShieldCheck, ThumbsUp, Hash, Edit3, Lock, GitBranch, Github, Building2, Scale, Users, ChevronDown, FileText, Database, Briefcase, CheckCircle, Video, Play, ExternalLink, Check, PenTool, Quote, Fingerprint, Copy } from 'lucide-react';
import ArtifactBadge from './ArtifactBadge';
import { useToast } from './ToastContext';
import UserHoverCard from './UserHoverCard';
import { MOCK_USERS } from '../constants';

interface ProjectDetailsModalProps {
  project: Project;
  userRole: UserRole;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onFeature?: (id: string) => void;
  onValidateMember?: (projectId: string, memberId: string) => void;
  onEndorse?: (id: string) => void;
  onEdit?: () => void;
  onUpdateProject?: (project: Project) => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ 
  project, 
  userRole, 
  onClose, 
  onApprove, 
  onReject, 
  onFeature,
  onValidateMember,
  onEndorse,
  onEdit,
  onUpdateProject
}) => {
  const isFaculty = userRole === UserRole.FACULTY;
  const isAdmin = userRole === UserRole.ADMIN;
  const isVerified = project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.FEATURED;

  const { showToast } = useToast();
  
  const [linkCopied, setLinkCopied] = useState(false);
  const [hasEndorsed, setHasEndorsed] = useState(false);
  const [localGrade, setLocalGrade] = useState(project.grade || '');
  const [localComments, setLocalComments] = useState(project.facultyComments || '');
  
  // State for User Hover Cards
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [showSupervisorCard, setShowSupervisorCard] = useState(false);

  const handleShare = () => {
    // Generate a permalink simulation
    navigator.clipboard.writeText(`https://projectsignal.ucp.edu.pk/p/${project.id}`);
    setLinkCopied(true);
    showToast("Project permalink copied to clipboard", "success");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCitation = () => {
    const citation = `${project.members.map(m => m.name.split(' ').pop()).join(', ')}. (${project.year}). "${project.title}". UCP ProjectSignal Repository.`;
    navigator.clipboard.writeText(citation);
    showToast("APA Citation copied to clipboard", "success");
  };

  const handleEndorseClick = () => {
    if (hasEndorsed) return;
    if (onEndorse) {
        onEndorse(project.id);
        setHasEndorsed(true);
        showToast("You endorsed this project! (+1 Signal Strength)", "success");
    }
  };

  const handleGradeSave = () => {
      if (onUpdateProject) {
          onUpdateProject({ ...project, grade: localGrade, facultyComments: localComments });
          showToast("Evaluation Signal Published to Transcript", "success");
      }
  };

  const canViewRepo = () => {
      if (userRole === UserRole.STUDENT) return true;
      if (userRole === UserRole.FACULTY || userRole === UserRole.ADMIN) return true;
      if (userRole === UserRole.PUBLIC) return project.repositoryVisibility === VisibilityLevel.PUBLIC;
      return false;
  };

  const handleViewAssets = (url: string | undefined) => {
      if (url && url !== '#') {
          window.open(url, '_blank');
      } else {
          showToast("Demo Asset Link: Repository access is restricted or placeholder.", "info");
      }
  };

  const getRepoConfig = () => {
      switch (project.type) {
          case ProjectType.FINANCE:
          case ProjectType.STRATEGY:
              return { label: "Project Files / Data Drive", icon: Database };
          case ProjectType.DESIGN:
              return { label: "Design Assets / CAD", icon: FileText };
          case ProjectType.RESEARCH:
               return { label: "Research Data Repository", icon: Database };
          default:
              return { label: "Source Code Repository", icon: Github };
      }
  };

  const { label: repoLabel, icon: RepoIcon } = getRepoConfig();
  
  // Find Supervisor Object for Hover Card
  const supervisorUser = MOCK_USERS.find(u => u.id === project.supervisorId) || {
      id: 'unknown',
      name: project.supervisorName || 'Unknown Faculty',
      role: UserRole.FACULTY,
      email: 'faculty@ucp.edu.pk',
      departmentId: project.departmentId
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-full max-h-[92vh] bg-[#fdfdfc] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/40 ring-1 ring-black/5 font-sans">
        
        {/* Compact Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur border-b border-stone-200 z-20">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className={`shrink-0 w-3 h-3 rounded-full ${isVerified ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`}></div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 leading-none">Project Signal ID: {project.id.toUpperCase()}</span>
                    <h2 className="text-lg font-bold text-stone-800 truncate font-serif leading-tight">{project.title}</h2>
                </div>
                {isVerified && (
                    <span className="hidden sm:flex px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100 items-center shadow-sm">
                        <ShieldCheck className="w-3 h-3 mr-1.5" /> Verified Signal
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {onEdit && (
                    <button onClick={onEdit} className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-stone-50 text-stone-600 rounded-lg text-xs font-bold uppercase hover:bg-stone-100 transition-colors border border-stone-200">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                )}
                <button 
                    onClick={onClose}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafaf9]">
            
            {/* Hero Image */}
            <div className="relative w-full h-56 md:h-72 overflow-hidden group">
                 {project.coverImage ? (
                    <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                        <Briefcase className="w-20 h-20 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-[#fafaf9]/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 md:left-10 flex flex-wrap gap-2">
                     <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm text-stone-800 border border-white/50">
                        {project.type}
                     </span>
                     {project.industryPartner && (
                         <span className="px-3 py-1.5 bg-ucp-navy/95 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center">
                             <Building2 className="w-3 h-3 mr-1.5" /> Partner: {project.industryPartner}
                         </span>
                     )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 md:p-10 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Primary Content (Left) */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Title & Tags */}
                        <div>
                             <h1 className="text-3xl md:text-5xl font-serif font-black text-stone-900 leading-[1.1] mb-5 text-balance">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags?.map((tag, i) => (
                                    <span key={i} className="flex items-center px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-[11px] font-bold uppercase tracking-wide border border-stone-200">
                                        <Hash className="w-3 h-3 mr-1 text-stone-400" /> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Video Demo (New Section) */}
                        {project.demoVideoUrl && (
                            <section className="bg-black rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-stone-800 relative group">
                                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-md">
                                    <Play className="w-3 h-3 fill-current" /> Live Demo
                                </div>
                                <div className="aspect-video w-full flex items-center justify-center bg-stone-900 relative">
                                    <div className="text-center z-10">
                                        <p className="text-stone-500 text-sm mb-3">Video Embed Placeholder</p>
                                        <a href={project.demoVideoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors border border-white/10">
                                            Watch on YouTube <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    {/* Scanlines Effect */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/scanlines.png')] opacity-20 pointer-events-none"></div>
                                </div>
                            </section>
                        )}

                        {/* Abstract */}
                        <section>
                            <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-3 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-stone-400" /> Executive Abstract
                            </h3>
                            <p className="text-lg leading-relaxed font-normal text-stone-700 text-justify text-pretty">
                                {project.abstract}
                            </p>
                        </section>

                        {/* Outcomes */}
                        <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-1 h-full bg-ucp-crimson group-hover:w-1.5 transition-all"></div>
                             <h3 className="flex items-center mb-3 text-xs font-bold tracking-widest text-ucp-crimson uppercase">
                                <Zap className="w-4 h-4 mr-2" /> Verified Outcomes
                            </h3>
                            <p className="text-stone-800 font-medium leading-relaxed">
                                {project.outcomes || "No specific outcomes listed."}
                            </p>
                        </section>

                         {/* Source / Repository (Dynamic) */}
                        <section className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                            <h3 className="flex items-center mb-5 text-xs font-bold tracking-widest text-stone-500 uppercase">
                                <GitBranch className="w-4 h-4 mr-2" /> Asset Integrity & Access
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex flex-col justify-between gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-stone-900 text-white p-2.5 rounded-lg"><RepoIcon className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-800">{repoLabel}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-400 mt-0.5">
                                                    {project.repositoryVisibility === VisibilityLevel.PRIVATE && <Lock className="w-3 h-3 text-rose-400"/>}
                                                    {project.repositoryVisibility === VisibilityLevel.PUBLIC && <Users className="w-3 h-3 text-emerald-400"/>}
                                                    {project.repositoryVisibility} Access
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {project.repositoryUrl && canViewRepo() ? (
                                        <button onClick={() => handleViewAssets(project.repositoryUrl)} className="w-full py-2 bg-stone-100 hover:bg-stone-800 hover:text-white text-stone-600 rounded-lg text-xs font-bold transition-all">
                                            Access Repository
                                        </button>
                                    ) : (
                                        <div className="w-full py-2 bg-stone-50 text-stone-400 rounded-lg text-xs font-bold border border-stone-100 flex items-center justify-center gap-2 cursor-not-allowed">
                                            <Lock className="w-3 h-3" /> Restricted
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm flex flex-col justify-center gap-2">
                                     <div className="flex items-center gap-3 mb-2">
                                         <div className="bg-stone-100 text-stone-600 p-2 rounded-lg"><Scale className="w-5 h-5"/></div>
                                         <span className="text-sm font-bold text-stone-800">IP & Licensing</span>
                                     </div>
                                     <p className="text-xs text-stone-500 font-medium pl-1 leading-relaxed">
                                        {project.license || 'All Rights Reserved'}
                                        <br/>
                                        <span className="text-[10px] text-stone-400"> governed by University Policy 2024.</span>
                                     </p>
                                </div>
                            </div>
                        </section>

                         {/* Team Profiles (Rich Cards) */}
                        <section>
                            <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-3 mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-stone-400" /> Project Team
                            </h3>
                            <div className="space-y-4">
                                {project.members.map((member) => (
                                    <div key={member.id} className="relative group/member">
                                        <div 
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group-hover/member:bg-slate-50/50"
                                            onClick={() => setActiveMemberId(activeMemberId === member.id ? null : member.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 shrink-0 rounded-full bg-white flex items-center justify-center font-serif font-bold text-slate-500 text-lg border-2 border-slate-100 shadow-sm">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-stone-900 group-hover/member:text-ucp-navy transition-colors">{member.name}</h4>
                                                        {member.validated && (
                                                            <span title="Competency Verified">
                                                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-stone-500 italic mb-1.5">{member.contribution}</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {member.skills.map(s => (
                                                            <span key={s} className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Faculty Validation Button */}
                                            {isFaculty && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onValidateMember && onValidateMember(project.id, member.id); }}
                                                    className={`mt-3 sm:mt-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors z-10 relative ${
                                                        member.validated 
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                                        : 'bg-white border-stone-200 text-stone-400 hover:border-ucp-navy hover:text-ucp-navy'
                                                    }`}
                                                >
                                                    {member.validated ? 'Verified' : 'Verify'}
                                                </button>
                                            )}
                                        </div>

                                        {/* User Hover Card Implementation */}
                                        {activeMemberId === member.id && (
                                            <UserHoverCard 
                                                member={{...member, departmentId: project.departmentId, role: UserRole.STUDENT}} 
                                                onClose={() => setActiveMemberId(null)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Meta Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Signal Verification Badge (New) */}
                        <div className={`p-5 rounded-xl border relative overflow-hidden ${isVerified ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100' : 'bg-stone-50 border-stone-200'}`}>
                            {isVerified ? (
                                <>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Fingerprint className="w-6 h-6" /></div>
                                        <div>
                                            <h4 className="font-bold text-emerald-900 text-sm">Verified Signal</h4>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase">Cryptographically Signed</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/60 p-2 rounded border border-emerald-100/50">
                                        <code className="text-[9px] text-emerald-800 break-all font-mono leading-tight block">
                                            0x{project.id.split('-')[1]}...{Date.parse(project.lastUpdated).toString(16)}
                                        </code>
                                    </div>
                                    <p className="text-[10px] text-emerald-600 mt-2 font-medium">Validated by {project.supervisorName || 'Department'}</p>
                                </>
                            ) : (
                                <div className="text-center py-2 opacity-50">
                                    <Fingerprint className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                                    <p className="text-xs font-bold text-stone-500 uppercase">Verification Pending</p>
                                </div>
                            )}
                        </div>

                        {/* Governance Card */}
                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative">
                             <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-stone-400">Academic Governance</h3>
                             <div className="space-y-4">
                                 <div className="relative">
                                     <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Supervisor</span>
                                     <div 
                                        className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg -ml-2 transition-colors group"
                                        onClick={() => setShowSupervisorCard(!showSupervisorCard)}
                                     >
                                         <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                             {project.supervisorName ? project.supervisorName.charAt(0) : 'F'}
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-sm font-bold text-stone-700">{project.supervisorName || 'Unassigned'}</span>
                                            <span className="text-[10px] text-indigo-600 font-bold group-hover:underline">View Faculty Profile</span>
                                         </div>
                                     </div>
                                     {/* Supervisor Hover Card */}
                                     {showSupervisorCard && (
                                        <UserHoverCard 
                                            member={supervisorUser}
                                            onClose={() => setShowSupervisorCard(false)}
                                        />
                                     )}
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Department</span>
                                        <span className="text-sm font-medium text-stone-600">{project.departmentId.replace('dept-', '').toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Last Updated</span>
                                        <span className="text-sm font-medium text-stone-600">{new Date(project.lastUpdated).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                             </div>
                        </div>

                        {/* Artifacts */}
                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                            <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-stone-400">Artifacts</h3>
                            <div className="space-y-2">
                                {project.artifacts.length > 0 ? project.artifacts.map((art) => (
                                    <div key={art.id} className="flex items-center justify-between p-2 border border-stone-100 rounded-lg bg-stone-50 hover:bg-white transition-colors group">
                                        <div className="min-w-0 flex-1">
                                            <ArtifactBadge artifact={art} userRole={userRole} />
                                        </div>
                                        <button onClick={() => handleViewAssets(art.url)} className="p-1.5 text-stone-300 group-hover:text-indigo-600 transition-colors" title="Download Asset"><Download className="w-4 h-4" /></button>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <p className="text-xs text-stone-400 italic">No public artifacts available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Endorsements Actions */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 text-center shadow-sm">
                            <div className="text-4xl font-black text-ucp-navy mb-1 tracking-tighter">{project.endorsements}</div>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">Community Signals</div>
                            <div className="space-y-2">
                                <button 
                                    onClick={handleEndorseClick}
                                    disabled={hasEndorsed}
                                    className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${hasEndorsed ? 'bg-indigo-100 text-indigo-400 cursor-default' : 'bg-ucp-navy text-white hover:bg-slate-800 shadow-lg shadow-indigo-900/10 active:scale-[0.98]'}`}
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" /> {hasEndorsed ? 'Signal Sent' : 'Endorse Project'}
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={handleShare}
                                        className="py-2.5 bg-white border border-indigo-100 text-ucp-navy rounded-lg text-xs font-bold uppercase hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5"
                                    >
                                        {linkCopied ? <CheckCircle className="w-3.5 h-3.5"/> : <Share2 className="w-3.5 h-3.5" />} Share
                                    </button>
                                    <button 
                                        onClick={handleCitation}
                                        className="py-2.5 bg-white border border-indigo-100 text-ucp-navy rounded-lg text-xs font-bold uppercase hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5"
                                        title="Copy Citation"
                                    >
                                        <Quote className="w-3.5 h-3.5" /> Cite
                                    </button>
                                </div>
                            </div>
                        </div>

                         {/* Faculty Controls (Redesigned as "Signal Validation") */}
                        {(isFaculty || isAdmin) && (
                            <div className="p-5 bg-stone-900 rounded-xl border border-stone-800 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ShieldCheck className="w-20 h-20" />
                                </div>
                                <h3 className="mb-4 text-[10px] font-bold tracking-widest uppercase text-stone-400 border-b border-stone-700 pb-2">Academic Validation Console</h3>
                                <div className="space-y-4 relative z-10">
                                    {project.status === ProjectStatus.SUBMITTED && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => onApprove && onApprove(project.id)} className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-900/50">Verify Signal</button>
                                            <button onClick={() => onReject && onReject(project.id)} className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-stone-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">Return</button>
                                        </div>
                                    )}
                                    {(project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.FEATURED) && (
                                        <button onClick={() => onFeature && onFeature(project.id)} className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-violet-900/50">
                                            <Award className="w-3 h-3" /> {project.status === ProjectStatus.FEATURED ? 'Featured in Hall of Fame' : 'Promote to Hall of Fame'}
                                        </button>
                                    )}
                                    
                                    <div className="pt-2">
                                        <label className="text-[10px] text-stone-400 font-bold uppercase block mb-1.5 flex items-center gap-2">
                                            <PenTool className="w-3 h-3" /> Evaluation Metric
                                        </label>
                                        <div className="relative mb-2">
                                            <select 
                                                value={localGrade} 
                                                onChange={(e) => setLocalGrade(e.target.value)}
                                                className="w-full p-2.5 pl-3 pr-8 text-xs font-bold text-white bg-white/10 border border-white/20 rounded-lg appearance-none cursor-pointer focus:border-indigo-500 focus:bg-white/20 outline-none hover:bg-white/15 transition-colors"
                                            >
                                                <option value="" disabled className="text-black">Select Competency Level</option>
                                                {GRADES.map(g => <option key={g} value={g} className="text-black">{g}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/50 pointer-events-none" />
                                        </div>
                                        
                                        <textarea 
                                            placeholder="Private Faculty Remarks..."
                                            value={localComments}
                                            onChange={(e) => setLocalComments(e.target.value)}
                                            rows={2}
                                            className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder:text-stone-500 outline-none focus:border-indigo-500 focus:bg-white/20 resize-none mb-3 transition-colors"
                                        />

                                        <button onClick={handleGradeSave} className="w-full py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-2">
                                           <Check className="w-3 h-3" /> Publish Evaluation Signal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;