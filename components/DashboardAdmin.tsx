import React from 'react';
import { Project, User, ProjectStatus } from '../types';
import { DEPARTMENTS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, PieChart as PieChartIcon, Activity, TrendingUp, BrainCircuit } from 'lucide-react';

interface DashboardAdminProps {
  user: User;
  projects: Project[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ user, projects }) => {
  
  // 1. Department Performance Data
  const deptData = DEPARTMENTS.map(dept => {
    const deptProjects = projects.filter(p => p.departmentId === dept.id);
    return {
      name: dept.name.split(' ')[0], // Short name
      total: deptProjects.length,
      approved: deptProjects.filter(p => p.status === ProjectStatus.APPROVED).length
    };
  });

  // 2. Status Distribution Data
  const statusData = [
    { name: 'Approved', value: projects.filter(p => p.status === ProjectStatus.APPROVED).length },
    { name: 'Submitted', value: projects.filter(p => p.status === ProjectStatus.SUBMITTED).length },
    { name: 'Rejected', value: projects.filter(p => p.status === ProjectStatus.REJECTED).length },
    { name: 'Featured', value: projects.filter(p => p.status === ProjectStatus.FEATURED).length },
  ];

  // 3. Skill/Competency Aggregation (New Feature)
  const skillCounts: Record<string, number> = {};
  projects.forEach(p => {
    p.members.forEach(m => {
        if(m.validated) { // Only count validated skills for accuracy
            m.skills.forEach(skill => {
                const s = skill.trim();
                skillCounts[s] = (skillCounts[s] || 0) + 1;
            });
        }
    });
  });
  
  const skillData = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 Skills

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-2">University Analytics</h1>
          <p className="text-slate-500 text-lg font-medium">Real-time performance & competency insights.</p>
        </div>
        <button className="flex items-center bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Projects</h3>
            <p className="mt-2 text-4xl font-black text-slate-800">{projects.length}</p>
            <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 w-fit px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +12% YoY</div>
         </div>
         <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Departments</h3>
            <p className="mt-2 text-4xl font-black text-slate-800">{DEPARTMENTS.length}</p>
            <div className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded-full">Across Campus</div>
         </div>
         <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approval Rate</h3>
            <p className="mt-2 text-4xl font-black text-indigo-600">
              {projects.length > 0 
                ? Math.round(((projects.filter(p => p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FEATURED).length) / projects.length) * 100) 
                : 0}%
            </p>
            <div className="mt-2 text-xs font-bold text-slate-500">Post-Faculty Review</div>
         </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-lg mr-3"><Activity className="w-5 h-5 text-indigo-600" /></span>
            Department Throughput
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={deptData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)'}} />
                <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                <Bar dataKey="total" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Submitted" barSize={20} />
                <Bar dataKey="approved" fill="#6366f1" radius={[4, 4, 0, 0]} name="Approved" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Mapping (New) */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
             <span className="bg-purple-100 p-2 rounded-lg mr-3"><BrainCircuit className="w-5 h-5 text-purple-600" /></span>
             Top Verified Competencies
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={skillData} layout="vertical" margin={{top: 0, right: 30, left: 10, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} name="Students Verified" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Status Distribution */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 min-h-[350px] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
                    <span className="bg-emerald-100 p-2 rounded-lg mr-3"><PieChartIcon className="w-5 h-5 text-emerald-600" /></span>
                    Project Status Distribution
                </h3>
                <p className="text-slate-500 mb-6">Overview of project lifecycle stages across the current academic year.</p>
                <div className="grid grid-cols-2 gap-4">
                    {statusData.map((s, i) => (
                        <div key={i} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                            <div>
                                <div className="text-xl font-bold text-slate-800">{s.value}</div>
                                <div className="text-xs text-slate-400 uppercase font-bold">{s.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full md:w-[400px] h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;