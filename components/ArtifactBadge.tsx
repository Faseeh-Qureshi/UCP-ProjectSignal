import React from 'react';
import { Artifact, VisibilityLevel, UserRole } from '../types';
import { FileText, Lock, Globe, Users, Building, File, Video, Code } from 'lucide-react';

interface ArtifactBadgeProps {
  artifact: Artifact;
  userRole: UserRole;
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
  if (type.includes('mp4') || type.includes('video')) return <Video className="h-4 w-4" />;
  if (type.includes('zip') || type.includes('code')) return <Code className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const getVisibilityIcon = (level: VisibilityLevel) => {
  switch (level) {
    case VisibilityLevel.PUBLIC: return <Globe className="h-3 w-3" />;
    case VisibilityLevel.DEPARTMENT: return <Building className="h-3 w-3" />;
    case VisibilityLevel.FACULTY: return <Users className="h-3 w-3" />;
    case VisibilityLevel.PRIVATE: return <Lock className="h-3 w-3" />;
  }
};

const getVisibilityStyles = (level: VisibilityLevel) => {
  switch (level) {
    case VisibilityLevel.PUBLIC: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case VisibilityLevel.DEPARTMENT: return 'bg-blue-50 text-blue-700 border-blue-100';
    case VisibilityLevel.FACULTY: return 'bg-amber-50 text-amber-700 border-amber-100';
    case VisibilityLevel.PRIVATE: return 'bg-stone-100 text-stone-500 border-stone-200';
  }
};

const ArtifactBadge: React.FC<ArtifactBadgeProps> = ({ artifact, userRole }) => {
  // Access Control Logic
  const canView = () => {
    if (userRole === UserRole.STUDENT) return true; 
    if (userRole === UserRole.FACULTY || userRole === UserRole.ADMIN) return true;
    if (userRole === UserRole.PUBLIC) return artifact.visibility === VisibilityLevel.PUBLIC;
    return false;
  };

  if (!canView()) return null;

  return (
    <div className="flex items-center justify-between w-full gap-3 overflow-hidden">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="shrink-0 p-1.5 bg-white border border-stone-200 rounded-md text-stone-600 shadow-sm">
          {getFileIcon(artifact.fileType)}
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-stone-700 truncate" title={artifact.fileName}>
                {artifact.fileName}
            </span>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wide">{artifact.fileType.toUpperCase()}</span>
        </div>
      </div>
      
      <div className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] border font-bold uppercase tracking-wider ${getVisibilityStyles(artifact.visibility)}`}>
        {getVisibilityIcon(artifact.visibility)}
        <span className="hidden xl:inline">{artifact.visibility.split(' ')[0]}</span>
      </div>
    </div>
  );
};

export default ArtifactBadge;