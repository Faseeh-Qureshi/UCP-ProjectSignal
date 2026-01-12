import React from 'react';
import { Project, ProjectStatus, UserRole } from '../types';
import { DEPARTMENTS } from '../constants';
import { Calendar, CheckCircle, Award, Image as ImageIcon, ThumbsUp, Hash, UserCheck, Trophy } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  userRole: UserRole;
  onApprove?: (e?: React.MouseEvent, id?: string) => void;
  onReject?: (e?: React.MouseEvent, id?: string) => void;
  onFeature?: (e?: React.MouseEvent, id?: string) => void;
  onEndorse?: (id: string) => void;
  showAdminControls?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, userRole, onApprove, onReject, onFeature, onEndorse, showAdminControls }) => {
  const dept = DEPARTMENTS.find(d => d.id === project.departmentId);
  const deptName = dept?.name || 'Unknown Dept';
  const deptColor = dept?.color || 'bg-slate-100 text-slate-800';

  const isFeatured = project.status === ProjectStatus.FEATURED;

  const handleEndorseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEndorse) onEndorse(project.id);
  };

  return (
    <div className={`relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] group hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 ring-1 ring-stone-100 ${isFeatured ? 'ring-2 ring-ucp-gold/50' : ''}`}>
      
      {/* Visual Cover Section */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100 border-b border-stone-100">
        {project.coverImage ? (
            <img 
                src={project.coverImage} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
                <ImageIcon className="w-10 h-10" />
            </div>
        )}
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Status Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {isFeatured && (
                <span className="bg-ucp-gold/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center border border-white/20">
                    <Trophy className="w-3 h-3 mr-1.5" /> Hall of Fame
                </span>
            )}
            {project.status === ProjectStatus.APPROVED && !isFeatured && (
                <span className="bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center border border-white/20">
                    <CheckCircle className="w-3 h-3 mr-1.5" /> Verified
                </span>
            )}
            {project.awards && project.awards.length > 0 && (
                <span className="bg-white/90 backdrop-blur-md text-ucp-navy px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center border border-white/20">
                    <Award className="w-3 h-3 mr-1.5 text-ucp-crimson" /> Award Winner
                </span>
            )}
        </div>
        
        {/* Department Badge on Image */}
        <div className="absolute top-3 left-3">
             <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-sm border border-white/20 backdrop-blur-md ${isFeatured ? 'bg-ucp-navy text-white' : 'bg-white/90 text-slate-800'}`}>
                {deptName.split(' ')[0]}
            </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                {project.type}
            </span>
            <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2 font-serif group-hover:text-ucp-navy transition-colors">
                {project.title}
            </h3>
        </div>

        <p className="text-xs font-medium leading-relaxed text-slate-500 line-clamp-3">
            {project.abstract}
        </p>
        
        {/* Supervisor Attribution (Academic Credibility) */}
        {project.supervisorName && (
            <div className="flex items-center gap-2 pt-1 pb-1">
                <div className="p-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400">
                    <UserCheck className="w-3 h-3" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Supervised By</span>
                    <span className="text-xs font-bold text-slate-700">{project.supervisorName}</span>
                </div>
            </div>
        )}

        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
            {/* Team */}
            <div className="flex -space-x-1.5 pl-1.5">
                {project.members.map((m, i) => (
                    <div key={i} className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600 shadow-sm z-0 hover:z-10 ring-1 ring-slate-100" title={m.name}>
                        {m.name.charAt(0)}
                    </div>
                ))}
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <Calendar className="w-3 h-3 mr-1" /> {project.term} {project.year}
                </span>
                <button 
                    onClick={handleEndorseClick}
                    className="flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors group/endorse"
                >
                    <ThumbsUp className="w-3 h-3 mr-1 group-hover/endorse:scale-110 transition-transform" />
                    {project.endorsements}
                </button>
            </div>
        </div>

        {/* Admin/Faculty Actions */}
        {showAdminControls && (
            <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-dashed border-stone-200">
            {project.status === ProjectStatus.SUBMITTED && (
                <>
                    <button 
                        onClick={(e) => onApprove?.(e, project.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                        Verify
                    </button>
                    <button 
                        onClick={(e) => onReject?.(e, project.id)}
                        className="bg-white border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                        Return
                    </button>
                </>
            )}
            {project.status === ProjectStatus.APPROVED && (
                <button 
                    onClick={(e) => onFeature?.(e, project.id)}
                    className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center shadow-sm"
                >
                    <Award className="w-3 h-3 mr-1.5" /> Promote to Hall of Fame
                </button>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;