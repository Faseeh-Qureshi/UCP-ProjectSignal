import React from 'react';
import { User, UserRole } from '../types';
import { Mail, Briefcase, MapPin, Linkedin, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useToast } from './ToastContext';

interface UserHoverCardProps {
  member: Partial<User> & { rollNumber?: string; contribution?: string; skills?: string[]; validated?: boolean };
  onClose: () => void;
}

const UserHoverCard: React.FC<UserHoverCardProps> = ({ member, onClose }) => {
  const { showToast } = useToast();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Navigating to ${member.name}'s full profile...`, 'info');
    onClose();
  };

  const handleLinkedInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this wraps an anchor.
  };

  return (
    <div className="absolute z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden font-sans ring-1 ring-black/5" style={{ top: '100%', left: '0', marginTop: '8px' }}>
      
      {/* Mini Cover Header */}
      <div className="h-20 bg-gradient-to-r from-ucp-navy to-slate-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-2 p-1 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
         </button>
      </div>

      {/* Avatar & Basic Info */}
      <div className="px-5 pb-5">
        <div className="relative -mt-10 mb-3 flex justify-between items-end">
             <div className="h-20 w-20 rounded-full border-[4px] border-white bg-slate-100 flex items-center justify-center shadow-lg overflow-hidden text-2xl font-black text-ucp-navy">
                {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                    <span>{member.name?.charAt(0)}</span>
                )}
             </div>
             {member.role === UserRole.FACULTY && (
                 <span className="mb-2 px-2 py-1 bg-ucp-gold/10 text-ucp-gold text-[9px] font-bold uppercase tracking-wider border border-ucp-gold/20 rounded-md">
                     Faculty
                 </span>
             )}
        </div>

        <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                {member.name}
                {member.validated && (
                    <span title="University Verified">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    </span>
                )}
            </h3>
            <p className="text-sm text-slate-500 font-medium">{member.contribution || member.designation || member.role || 'Project Member'}</p>
             {member.rollNumber && <p className="text-xs text-slate-400 mt-0.5 font-mono">{member.rollNumber}</p>}
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-6 pt-3 border-t border-slate-50">
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="truncate font-medium">{member.departmentId ? member.departmentId.replace('dept-', '').toUpperCase() + ' Department' : 'University Member'}</span>
            </div>
            {member.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${member.email}`} className="hover:text-ucp-crimson truncate hover:underline font-medium text-slate-700">{member.email}</a>
                </div>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-medium">UCP Main Campus</span>
            </div>
        </div>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
            <div className="mb-6">
                <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded text-[10px] font-bold uppercase tracking-wide">
                            {skill}
                        </span>
                    ))}
                    {member.skills.length > 4 && <span className="text-[10px] text-slate-400 px-1 font-bold pt-1">+{member.skills.length - 4}</span>}
                </div>
            </div>
        )}

        {/* Actions - Now Fully Functional */}
        <div className="flex gap-2">
            <a 
                href={`mailto:${member.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-ucp-navy text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98]"
            >
                <Mail className="w-3.5 h-3.5" /> Email
            </a>
            {member.linkedInUrl && (
                 <a 
                    href={`https://${member.linkedInUrl}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={handleLinkedInClick}
                    className="flex items-center justify-center w-10 border border-slate-200 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors active:scale-[0.95]"
                >
                    <Linkedin className="w-4 h-4" />
                </a>
            )}
             <button 
                onClick={handleProfileClick}
                className="flex items-center justify-center w-10 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors active:scale-[0.95]"
                title="View Full Profile"
             >
                <UserIcon className="w-4 h-4" />
            </button>
        </div>

      </div>
    </div>
  );
};

export default UserHoverCard;