import React from 'react';
import { ProjectStatus } from '../types';
import { Check, Clock, Send, XCircle, Award } from 'lucide-react';

interface ProjectStatusTrackerProps {
  status: ProjectStatus;
}

const ProjectStatusTracker: React.FC<ProjectStatusTrackerProps> = ({ status }) => {
  const isRejected = status === ProjectStatus.REJECTED;

  const steps = [
    { label: 'Submit', icon: Send },
    { label: 'Review', icon: Clock },
    { label: 'Signal', icon: Check },
    { label: 'Fame', icon: Award }
  ];

  const activeIndex = (() => {
    switch (status) {
      case ProjectStatus.SUBMITTED: return 1;
      case ProjectStatus.APPROVED: return 2;
      case ProjectStatus.FEATURED: return 3;
      default: return 0;
    }
  })();

  if (isRejected) {
    return (
      <div className="w-full mt-2 bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-center justify-center text-rose-700 shadow-sm">
        <XCircle className="w-4 h-4 mr-2" />
        <span className="font-bold text-xs">Revision Requested</span>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative px-1">
        {/* Background Line */}
        <div className="absolute top-3.5 left-0 w-full h-1 bg-stone-100 -z-10 rounded-full" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-3.5 left-0 h-1 bg-indigo-500 -z-10 transition-all duration-700 ease-out rounded-full"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = step.icon;

          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <div 
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border-2
                  ${isCurrent 
                    ? 'bg-indigo-600 text-white border-white shadow-md scale-110' 
                    : isCompleted 
                      ? 'bg-indigo-500 text-white border-indigo-500' 
                      : 'bg-white border-stone-200 text-stone-300'
                  }
                `}
              >
                <Icon className="w-3 h-3" strokeWidth={3} />
              </div>
              
              <span 
                className={`
                  text-[9px] font-bold uppercase tracking-wider
                  ${isCurrent ? 'text-indigo-700' : 'text-stone-400'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStatusTracker;