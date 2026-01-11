import React, { useState } from 'react';
import { Project, UserRole, ProjectStatus } from '../types';
import { X, CheckCircle, FileText, Download, Award, Zap, Share2, Calendar, ShieldCheck, Quote, ChevronRight } from 'lucide-react';
import ProjectStatusTracker from './ProjectStatusTracker';
import ArtifactBadge from './ArtifactBadge';

interface ProjectDetailsModalProps {
  project: Project;
  userRole: UserRole;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onFeature?: (id: string) => void;
  onValidateMember?: (projectId: string, memberId: string) => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ 
  project, 
  userRole, 
  onClose, 
  onApprove, 
  onReject, 
  onFeature,
  onValidateMember
}) => {
  const isFaculty = userRole === UserRole.FACULTY;
  const isAdmin = userRole === UserRole.ADMIN;
  
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Main Modal Container - Responsive Width & Height */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#fdfdfc] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 ring-1 ring-black/5">
        
        {/* Header Section - Split Layout for Art & Info */}
        <div className="shrink-0 flex flex-col md:flex-row border-b border-stone-200 bg-white relative">
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white text-stone-500 rounded-full transition-all backdrop-blur-md border border-stone-200/50 shadow-sm"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Left: Cover Image */}
            <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-stone-100 group">
                {project.coverImage ? (
                    <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                        <FileText className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4">
                     <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm text-stone-800">
                        {project.type}
                     </span>
                </div>
            </div>

            {/* Right: Title & Core Meta */}
            <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3 text-stone-500 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" /> {project.year} Cohort</span>
                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                    <span>{project.departmentId.replace('dept-', '').toUpperCase()} Department</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight mb-4 text-balance">
                    {project.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                     <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                    >
                        {linkCopied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                        {linkCopied ? 'Link Copied' : 'Share Signal'}
                    </button>
                    {project.status === ProjectStatus.APPROVED && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafaf9]">
          <div className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* PRIMARY CONTENT (Left Col) */}
                <div className="lg:col-span-7 space-y-10">
                    
                    {/* Abstract */}
                    <section>
                        <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-3 mb-4 flex items-center">
                            Executive Abstract
                        </h3>
                        <p className="text-lg leading-relaxed font-light text-stone-700 text-justify">
                            {project.abstract}
                        </p>
                    </section>

                    {/* Outcomes */}
                    <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <h3 className="flex items-center mb-3 text-xs font-bold tracking-widest text-indigo-700 uppercase">
                            <Zap className="w-4 h-4 mr-2" /> Measured Outcomes
                        </h3>
                        <p className="text-stone-800 font-medium leading-relaxed">
                            {project.outcomes || "No specific outcomes listed."}
                        </p>
                    </section>

                    {/* Team Contributors */}
                    <section>
                        <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-3 mb-6 flex items-center">
                            Research & Development Team
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {project.members.map((member) => (
                                <div key={member.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-indigo-200 transition-colors shadow-sm">
                                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                        <div className="h-12 w-12 shrink-0 rounded-full bg-stone-100 flex items-center justify-center font-serif font-bold text-stone-500 text-lg border border-stone-200 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-stone-900">{member.name}</h4>
                                                {member.validated && (
                                                    <span title="Competency Validated" className="flex items-center">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-stone-500 italic mb-1.5">{member.contribution}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {member.skills.map(s => (
                                                    <span key={s} className="text-[10px] bg-stone-50 border border-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-bold uppercase tracking-wide">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Faculty Validation Action */}
                                    {isFaculty && (
                                        <button 
                                            onClick={() => onValidateMember && onValidateMember(project.id, member.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                                                member.validated 
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                                : 'bg-white border-stone-200 text-stone-400 hover:border-indigo-300 hover:text-indigo-600'
                                            }`}
                                        >
                                            {member.validated ? 'Verified' : 'Validate'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* SIDEBAR META (Right Col) */}
                <div className="lg:col-span-5 space-y-8">
                    
                    {/* Status Card */}
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Project Status</h3>
                             {project.status === ProjectStatus.FEATURED && <Award className="w-5 h-5 text-violet-500" />}
                        </div>
                        <ProjectStatusTracker status={project.status} />
                    </div>

                    {/* Artifacts - Fixed Overflow & Layout */}
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-stone-400">Evidence & Artifacts</h3>
                        <div className="space-y-3">
                            {project.artifacts.length > 0 ? project.artifacts.map((art) => (
                                <div key={art.id} className="flex items-center gap-3 p-2 border border-stone-100 rounded-lg bg-stone-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all group">
                                    <div className="flex-1 min-w-0"> {/* min-w-0 is CRITICAL for flex child truncation */}
                                        <ArtifactBadge artifact={art} userRole={userRole} />
                                    </div>
                                    <button className="p-2 text-stone-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-6 border border-dashed border-stone-200 rounded-lg bg-stone-50">
                                    <span className="text-xs text-stone-400">No public artifacts available.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Faculty/Admin Controls */}
                    {(isFaculty || isAdmin) && (
                        <div className="p-1 bg-stone-100 rounded-2xl border border-stone-200">
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-stone-900 flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" /> Administrative Actions
                                </h3>
                                
                                <div className="space-y-3">
                                    {project.status === ProjectStatus.SUBMITTED && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => onApprove && onApprove(project.id)} 
                                                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => onReject && onReject(project.id)} 
                                                className="py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    
                                    {project.status === ProjectStatus.APPROVED && (
                                        <button 
                                            onClick={() => onFeature && onFeature(project.id)} 
                                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center"
                                        >
                                            <Award className="w-4 h-4 mr-2" /> Mark as Hall of Fame
                                        </button>
                                    )}
                                    
                                    <div className="pt-3 border-t border-stone-100 mt-2">
                                         <p className="text-[10px] text-stone-400 mb-2">Faculty Comments (Private)</p>
                                         <textarea className="w-full text-xs p-2 border border-stone-200 rounded-lg bg-stone-50 min-h-[60px]" placeholder="Add notes..."></textarea>
                                    </div>
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