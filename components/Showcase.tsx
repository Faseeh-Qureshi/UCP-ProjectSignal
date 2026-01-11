import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus, UserRole, ProjectType } from '../types';
import { DEPARTMENTS } from '../constants';
import ProjectCard from './ProjectCard';
import ProjectDetailsModal from './ProjectDetailsModal';
import { Search, SlidersHorizontal, Sparkles, X, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react';

interface ShowcaseProps {
  projects: Project[];
  userRole: UserRole;
}

const Showcase: React.FC<ShowcaseProps> = ({ projects, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Only show approved/featured projects to public
  const visibleProjects = useMemo(() => {
    return projects.filter(p => {
       const isApproved = p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED;
       // Faculty/Admin can see everything, Public/Students mostly see Approved in showcase
       if (userRole === UserRole.PUBLIC && !isApproved) return false;
       
       const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.members.some(m => m.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
       const matchesDept = selectedDept === 'All' || p.departmentId === selectedDept;
       const matchesType = selectedType === 'All' || p.type === selectedType;

       return matchesSearch && matchesDept && matchesType;
    });
  }, [projects, searchTerm, selectedDept, selectedType, userRole]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero / Landing Section */}
      <section className="relative text-center max-w-5xl mx-auto pt-10 md:pt-20 px-4">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        
        <div className="inline-flex items-center bg-white/80 backdrop-blur-md border border-indigo-100 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">University Hall of Fame</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1] animate-fade-in-up">
          Transforming Academic Effort into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Professional Signal</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto animate-fade-in-up mb-10">
          UCP-ProjectSignal curates, validates, and showcases final-year projects across all disciplines, converting internal grades into externally verifiable capability.
        </p>

        {/* Value Prop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-16 animate-fade-in-up delay-100">
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/20">
                <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Faculty Validated</h3>
                <p className="text-sm text-slate-500">Every project and skill is verified by supervisors, ensuring trust for employers.</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/20">
                <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Outcome Focused</h3>
                <p className="text-sm text-slate-500">Showcasing applied competencies and deliverables, not just academic transcripts.</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/20">
                <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                    <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Cross-Disciplinary</h3>
                <p className="text-sm text-slate-500">From Engineering to Psychology, celebrating diverse academic excellence.</p>
            </div>
        </div>
      </section>

      {/* Floating Filter Bar */}
      <div className="sticky top-20 z-30 max-w-6xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-2xl shadow-indigo-100/40 border border-white/60 flex flex-col md:flex-row gap-3 items-center transition-all hover:bg-white/95 ring-1 ring-white/50">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-slate-50/50 focus:bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-700 font-bold transition-all"
              placeholder="Search by topic, student name, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:flex-none">
              <select 
                className="w-full appearance-none bg-slate-50/50 hover:bg-white border-none text-slate-700 font-bold py-3.5 pl-5 pr-10 rounded-2xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer transition-all"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="All">All Depts</option>
                {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>

            <div className="relative flex-1 md:flex-none">
               <select 
                className="w-full appearance-none bg-slate-50/50 hover:bg-white border-none text-slate-700 font-bold py-3.5 pl-5 pr-10 rounded-2xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer transition-all"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Types</option>
                {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map(project => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                <ProjectCard project={project} userRole={userRole} />
            </div>
            ))}
        </div>
        
        {visibleProjects.length === 0 && (
            <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-200 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No projects found.</h3>
            <p className="text-slate-500 mt-2 font-medium">Try adjusting your filters or search terms.</p>
            <button 
                onClick={() => {setSearchTerm(''); setSelectedDept('All'); setSelectedType('All');}}
                className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
                Clear Filters
            </button>
            </div>
        )}
      </div>

      {/* Project Detail Modal for Public/All Viewers */}
      {selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject}
            userRole={userRole}
            onClose={() => setSelectedProject(null)}
            // Public cannot perform actions, so no handlers passed
        />
      )}
    </div>
  );
};

export default Showcase;