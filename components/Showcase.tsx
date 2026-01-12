import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus, UserRole, ProjectType } from '../types';
import { DEPARTMENTS } from '../constants';
import ProjectCard from './ProjectCard';
import ProjectDetailsModal from './ProjectDetailsModal';
import { Search, Sparkles, ShieldCheck, Building, Award, Crown, Zap, ArrowRight, Filter, X, ChevronDown, BookOpen, GraduationCap, Briefcase, Rocket, Globe, Microscope, Cpu, ThumbsUp, CalendarClock } from 'lucide-react';

interface ShowcaseProps {
  projects: Project[];
  userRole: UserRole;
  onEndorse?: (id: string) => void;
}

const Showcase: React.FC<ShowcaseProps> = ({ projects, userRole, onEndorse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCohort, setSelectedCohort] = useState<string>('All');
  const [activeCollection, setActiveCollection] = useState<'all' | 'dean' | 'industry' | 'research' | 'startup'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // --- DERIVE AVAILABLE COHORTS (Term + Year) ---
  const availableCohorts = useMemo(() => {
      const cohorts = new Set<string>();
      projects.forEach(p => {
          if (p.term && p.year) {
              cohorts.add(`${p.term} ${p.year}`);
          }
      });
      // Sort cohort logic: Newest years first, within year Fall > Summer > Spring
      return Array.from(cohorts).sort((a, b) => {
          const [termA, yearA] = a.split(' ');
          const [termB, yearB] = b.split(' ');
          if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
          const termOrder: Record<string, number> = { 'Fall': 3, 'Summer': 2, 'Spring': 1 };
          return termOrder[termB] - termOrder[termA];
      });
  }, [projects]);

  // --- FILTERING LOGIC ---
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
       // 1. Governance Rule: Public only sees Approved/Featured
       const isApproved = p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED;
       const isInternal = userRole === UserRole.STUDENT || userRole === UserRole.FACULTY || userRole === UserRole.ADMIN;
       if (!isInternal && !isApproved) return false;
       
       // 2. Text Search Rule
       const matchesSearch = !searchTerm || 
                             p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             p.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
       
       // 3. Department Rule
       const matchesDept = selectedDept === 'All' || p.departmentId === selectedDept;

       // 4. Cohort Rule (New)
       const matchesCohort = selectedCohort === 'All' || `${p.term} ${p.year}` === selectedCohort;

       // 5. Collection "Lens" Rules
       let matchesCollection = true;
       if (activeCollection === 'dean') {
           // Dean's List: Featured OR High Awards OR Grade A+
           matchesCollection = p.status === ProjectStatus.FEATURED || (p.awards && p.awards.length > 0) || p.grade === 'A+';
       }
       if (activeCollection === 'industry') {
           // Industry: Has Partner OR Application/Strategy Type
           matchesCollection = !!p.industryPartner || p.type === ProjectType.APPLICATION || p.type === ProjectType.STRATEGY;
       }
       if (activeCollection === 'research') {
           // Research: Research Type OR Patents
           matchesCollection = p.type === ProjectType.RESEARCH || !!p.license?.includes('Proprietary');
       }
       if (activeCollection === 'startup') {
           // Startup: FinTech, Blockchain, or Design
           matchesCollection = [ProjectType.FINANCE, ProjectType.BLOCKCHAIN, ProjectType.DESIGN].includes(p.type);
       }

       return matchesSearch && matchesDept && matchesCohort && matchesCollection;
    }).sort((a, b) => {
        // Sort: Hall of Fame > Endorsements > Date
        if (a.status === ProjectStatus.FEATURED && b.status !== ProjectStatus.FEATURED) return -1;
        if (b.status === ProjectStatus.FEATURED && a.status !== ProjectStatus.FEATURED) return 1;
        return b.endorsements - a.endorsements;
    });
  }, [projects, searchTerm, selectedDept, selectedCohort, activeCollection, userRole]);

  // --- SPOTLIGHT SELECTION ---
  const spotlightProject = useMemo(() => {
    // Pick the absolute best project to highlight (Top of the filtered list)
    if (filteredProjects.length === 0) return null;
    return filteredProjects[0];
  }, [filteredProjects]);

  // --- METRICS ---
  const metrics = useMemo(() => {
    return {
        totalSignals: projects.reduce((acc, curr) => acc + curr.endorsements, 0),
        industryPartners: new Set(projects.map(p => p.industryPartner).filter(Boolean)).size,
        researchPapers: projects.filter(p => p.type === ProjectType.RESEARCH).length,
        verifiedCount: projects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED).length
    };
  }, [projects]);

  const clearFilters = () => {
      setSearchTerm('');
      setSelectedDept('All');
      setSelectedCohort('All');
      setActiveCollection('all');
  };

  // --- COLLECTION CONFIG ---
  const collections = [
      { id: 'all', label: 'Global Registry', icon: Globe, desc: 'Live feed of all verified academic output.' },
      { id: 'dean', label: "Dean's List", icon: Crown, desc: 'High-distinction projects awarded for academic excellence.' },
      { id: 'industry', label: 'Industry Track', icon: Building, desc: 'Corporate collaborations and applied technical solutions.' },
      { id: 'research', label: 'R&D Labs', icon: Microscope, desc: 'Novel contributions to science and theoretical frameworks.' },
      { id: 'startup', label: 'Venture Ready', icon: Rocket, desc: 'High-growth potential projects in FinTech & Web3.' },
  ];

  const activeCollectionData = collections.find(c => c.id === activeCollection);

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      
      {/* 1. EXECUTIVE SUMMARY (Bento Grid) */}
      <section className="space-y-8">
          <div className="text-center space-y-4 max-w-4xl mx-auto pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 border border-slate-700 mb-2">
                  <Sparkles className="w-3 h-3 text-ucp-gold" /> Official University Repository
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-900 tracking-tight leading-none">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-ucp-navy to-ucp-crimson">Signal</span> Registry
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed text-balance">
                  A centralized ledger of <span className="text-slate-900 font-bold">University of Central Punjab's</span> highest-impact capstone projects, validated by faculty and endorsed by industry leaders.
              </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-ucp-navy/30 transition-colors">
                  <div className="mb-2 p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform"><ShieldCheck className="w-5 h-5"/></div>
                  <div className="text-2xl font-black text-slate-800">{metrics.verifiedCount}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Projects</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-ucp-navy/30 transition-colors">
                  <div className="mb-2 p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform"><Building className="w-5 h-5"/></div>
                  <div className="text-2xl font-black text-slate-800">{metrics.industryPartners}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry Partners</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-ucp-navy/30 transition-colors">
                  <div className="mb-2 p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform"><ThumbsUp className="w-5 h-5"/></div>
                  <div className="text-2xl font-black text-slate-800">{metrics.totalSignals}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal Strength</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-ucp-navy/30 transition-colors">
                  <div className="mb-2 p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5"/></div>
                  <div className="text-2xl font-black text-slate-800">{metrics.researchPapers}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Research Papers</div>
              </div>
          </div>
      </section>

      {/* 2. CINEMATIC SPOTLIGHT (Hero) */}
      {spotlightProject && !searchTerm && selectedDept === 'All' && selectedCohort === 'All' && activeCollection === 'all' && (
          <section className="relative w-full mx-auto max-w-7xl animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="w-2 h-2 rounded-full bg-ucp-crimson animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Spotlight Project of the Batch</span>
              </div>
              
              <div 
                className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl shadow-indigo-900/20 group cursor-pointer ring-1 ring-white/10 min-h-[450px] md:min-h-[500px]" 
                onClick={() => setSelectedProject(spotlightProject)}
              >
                  {/* Immersive Background */}
                  <div className="absolute inset-0 z-0">
                      <img 
                        src={spotlightProject.coverImage} 
                        alt="Spotlight" 
                        className="w-full h-full object-cover opacity-60 transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 max-w-4xl">
                      <div className="space-y-6">
                          <div className="flex flex-wrap gap-3">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ucp-gold text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-900/20">
                                  <Crown className="w-3 h-3 fill-current" /> Dean's Choice Award
                              </div>
                              {spotlightProject.industryPartner && (
                                   <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                       <Building className="w-3 h-3" /> Powered by {spotlightProject.industryPartner}
                                   </div>
                              )}
                          </div>
                          
                          <h2 className="text-4xl md:text-6xl font-serif font-black text-white leading-[1.05] tracking-tight text-balance drop-shadow-sm">
                              {spotlightProject.title}
                          </h2>
                          
                          <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl line-clamp-2 text-pretty">
                              {spotlightProject.abstract}
                          </p>

                          <div className="flex items-center gap-4 pt-4 group/btn">
                              <button className="h-14 px-8 rounded-full bg-white text-slate-900 font-bold text-sm tracking-wide hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-xl shadow-white/5">
                                  View Case Study <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                              <div className="flex -space-x-3">
                                  {spotlightProject.members.slice(0,3).map((m, i) => (
                                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-white text-xs font-bold" title={m.name}>{m.name.charAt(0)}</div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      )}

      {/* 3. CONTROL PLANE (Lenses & Filters) */}
      <section className="sticky top-20 z-40 mx-auto max-w-7xl px-4 sm:px-0 transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-white/60 ring-1 ring-black/5 flex flex-col gap-3">
            
            <div className="flex flex-col xl:flex-row justify-between items-center gap-3">
                {/* Lenses (Tabs) */}
                <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl w-full xl:w-auto overflow-x-auto no-scrollbar">
                    {collections.map(col => {
                        const Icon = col.icon;
                        const isActive = activeCollection === col.id;
                        return (
                            <button 
                                key={col.id}
                                onClick={() => setActiveCollection(col.id as any)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 xl:flex-none justify-center
                                    ${isActive 
                                        ? 'bg-white text-ucp-navy shadow-sm ring-1 ring-black/5' 
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                                `}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ucp-crimson' : 'text-slate-400'}`} />
                                {col.label}
                            </button>
                        );
                    })}
                </div>

                {/* Filters Group */}
                <div className="flex gap-2 w-full xl:w-auto overflow-x-auto">
                    {/* Cohort Filter (Term + Year) */}
                    <div className="relative group min-w-[140px]">
                        <select 
                            className="w-full h-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 appearance-none cursor-pointer hover:border-ucp-navy focus:border-ucp-navy focus:outline-none transition-colors shadow-sm"
                            value={selectedCohort}
                            onChange={(e) => setSelectedCohort(e.target.value)}
                        >
                            <option value="All">All Cohorts</option>
                            {availableCohorts.map(cohort => <option key={cohort} value={cohort}>{cohort}</option>)}
                        </select>
                        <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Department Filter */}
                    <div className="relative group min-w-[160px]">
                        <select 
                            className="w-full h-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 appearance-none cursor-pointer hover:border-ucp-navy focus:border-ucp-navy focus:outline-none transition-colors shadow-sm"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 group min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-ucp-navy transition-colors" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-ucp-navy focus:outline-none focus:ring-1 focus:ring-ucp-navy/20 transition-all placeholder:font-medium placeholder:text-slate-400"
                            placeholder="Search keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                         {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Lens Description Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50/50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-ucp-crimson"></span>
                    {activeCollectionData?.desc}
                    {selectedCohort !== 'All' && <span className="text-slate-400">• Filtering by <span className="text-slate-700 font-bold">{selectedCohort}</span> Cohort</span>}
                </div>
                {(selectedDept !== 'All' || searchTerm || selectedCohort !== 'All') && (
                     <button onClick={clearFilters} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1">
                        <X className="w-3 h-3" /> Clear filters
                    </button>
                )}
            </div>
        </div>
      </section>

      {/* 4. RESULTS GRID */}
      <section className="mx-auto min-h-[400px] max-w-7xl px-4 sm:px-0">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Showing {filteredProjects.length} Projects
            </h3>
        </div>

        {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProjects.map((project, index) => {
                    // Don't show the hero project again in the grid if we are in default view
                    const isHero = spotlightProject && project.id === spotlightProject.id && !searchTerm && selectedDept === 'All' && selectedCohort === 'All' && activeCollection === 'all';
                    if (isHero) return null;

                    return (
                        <div 
                            key={project.id} 
                            onClick={() => setSelectedProject(project)} 
                            className="cursor-pointer animate-in fade-in zoom-in-50 duration-500 fill-mode-backwards" 
                            style={{animationDelay: `${index * 75}ms`}}
                        >
                            <ProjectCard project={project} userRole={userRole} onEndorse={onEndorse} />
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-dashed border-slate-200 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 shadow-inner">
                    <Filter className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif">No signals found.</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                    We couldn't find any projects matching your current lens. Try switching to the Global Registry or clearing your search.
                </p>
                <button 
                    onClick={clearFilters}
                    className="px-8 py-3 bg-ucp-navy text-white rounded-xl font-bold text-sm shadow-xl shadow-ucp-navy/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                >
                    Reset & View All
                </button>
            </div>
        )}
      </section>

      {/* 5. FOOTER TRUST INDICATORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200/60 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-ucp-crimson shadow-sm"><ShieldCheck className="w-6 h-6" /></div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Rigorous Validation</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Every project on the Signal Registry has passed a multi-stage faculty review process.</p>
                  </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-ucp-navy shadow-sm"><Cpu className="w-6 h-6" /></div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Industry Standard</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Projects built using modern stacks (React, Python, AWS) ready for corporate deployment.</p>
                  </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-amber-600 shadow-sm"><Award className="w-6 h-6" /></div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">Top 1% Talent</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Featuring the highest performing graduates from the University of Central Punjab.</p>
                  </div>
              </div>
          </div>
      </section>

      {selectedProject && (
          <ProjectDetailsModal 
            project={selectedProject} 
            userRole={userRole} 
            onClose={() => setSelectedProject(null)} 
            onEndorse={onEndorse} 
          />
      )}
    </div>
  );
};

export default Showcase;