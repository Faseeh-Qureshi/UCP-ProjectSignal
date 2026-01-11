import React from 'react';
import { Project, ProjectStatus, UserRole } from '../types';
import { DEPARTMENTS } from '../constants';
import { Calendar, CheckCircle, Award, Users, ExternalLink, Image as ImageIcon } from 'lucide-react';
import ArtifactBadge from './ArtifactBadge';
import ProjectStatusTracker from './ProjectStatusTracker';

interface ProjectCardProps {
  project: Project;
  userRole: UserRole;
  onApprove?: (e?: React.MouseEvent, id?: string) => void;
  onReject?: (e?: React.MouseEvent, id?: string) => void;
  onFeature?: (e?: React.MouseEvent, id?: string) => void;
  showAdminControls?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, userRole, onApprove, onReject, onFeature, showAdminControls }) => {
  const dept = DEPARTMENTS.find(d => d.id === project.departmentId);
  const deptName = dept?.name || 'Unknown Dept';
  const deptColor = dept?.color || 'bg-slate-100 text-slate-800';

  return (
    <div className="relative flex flex-col h-full overflow-hidden transition-all duration-500 border group bg-white rounded-xl border-stone-200 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-1">
      
      {/* Visual Cover Section (The "Art" of Science) */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100 border-b border-stone-100">
        {project.coverImage ? (
            <img 
                src={project.coverImage} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
                <ImageIcon className="w-12 h-12" />
            </div>
        )}
        
        {/* Status Overlay */}
        <div className="absolute top-4 right-4">
            {project.status === ProjectStatus.APPROVED && (
                <span className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Signal Verified
                </span>
            )}
            {project.status === ProjectStatus.FEATURED && (
                <span className="bg-violet-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center">
                    <Award className="w-3 h-3 mr-1" /> Hall of Fame
                </span>
            )}
        </div>

        {/* Dept Overlay */}
        <div className="absolute bottom-4 left-4">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${deptColor} bg-opacity-90`}>
                {deptName}
            </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-6 space-y-5">
        
        <div>
            <h3 className="mb-2 text-xl font-serif font-bold leading-tight text-slate-900 group-hover:text-indigo-800 transition-colors">
                {project.title}
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-500 line-clamp-3 font-sans">
                {project.abstract}
            </p>
        </div>

        {/* Team Preview */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div className="flex -space-x-2">
                {project.members.map((m, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600" title={m.name}>
                        {m.name.charAt(0)}
                    </div>
                ))}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> {project.year}
            </div>
        </div>

        {/* Admin/Faculty Actions */}
        {showAdminControls && (
            <div className="grid grid-cols-2 gap-3 pt-2">
            {project.status === ProjectStatus.SUBMITTED && (
                <>
                    <button 
                        onClick={(e) => onApprove?.(e, project.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        Validate
                    </button>
                    <button 
                        onClick={(e) => onReject?.(e, project.id)}
                        className="bg-white border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        Return
                    </button>
                </>
            )}
            {project.status === ProjectStatus.APPROVED && (
                <button 
                    onClick={(e) => onFeature?.(e, project.id)}
                    className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
                >
                    <Award className="w-4 h-4 mr-2" /> Mark as Exemplary
                </button>
            )}
            </div>
        )}
      </div>
      
      {/* Hover Overlay Hint */}
      <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default ProjectCard;