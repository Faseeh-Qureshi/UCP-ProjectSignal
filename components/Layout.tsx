import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Building2, LogOut, User as UserIcon, ChevronDown, Menu, X, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  onRoleSwitch: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, onRoleSwitch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-x-hidden font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      
      {/* Global Noise Texture */}
      <div className="bg-noise"></div>

      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[120px] mix-blend-multiply animate-float-slow"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-violet-200/30 rounded-full blur-[120px] mix-blend-multiply animate-float-delayed"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] mix-blend-multiply animate-float-slow"></div>
      </div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-xl shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none font-display">UCP</span>
                <span className="font-bold text-[10px] text-indigo-600 tracking-widest uppercase leading-tight mt-0.5">ProjectSignal</span>
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-6">
              
               {/* Notifications (Mock) */}
               <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
               </button>

              {/* Role Switcher (Demo Feature) */}
              <div className="flex items-center bg-white/50 hover:bg-white/90 transition-all py-1.5 px-4 rounded-full border border-slate-200/60 shadow-sm group backdrop-blur-md">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mr-2">View As</span>
                <div className="relative">
                  <select 
                    className="bg-transparent font-bold text-slate-700 text-sm outline-none cursor-pointer appearance-none pr-5 z-10 relative hover:text-indigo-600 transition-colors"
                    value={currentUser.role}
                    onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
                  >
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200/60">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{currentUser.role}</span>
                </div>
                <div className="relative group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px] shadow-md cursor-pointer group-hover:shadow-lg transition-all">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onLogout} 
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" 
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
             <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl z-40 animate-fade-in-down">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                             <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{currentUser.name}</p>
                            <p className="text-xs text-slate-500">{currentUser.email}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="text-xs font-bold text-rose-500">Logout</button>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Switch View Role</label>
                    {Object.values(UserRole).map(role => (
                        <button 
                            key={role}
                            onClick={() => {
                                onRoleSwitch(role);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${currentUser.role === role ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
             </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 animate-fade-in-up">
        {children}
      </main>

      {/* Glass Footer */}
      <footer className="relative mt-auto z-10 border-t border-slate-200/60">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-lg"></div>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2 opacity-70">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    <span className="font-bold text-slate-700">UCP ProjectSignal</span>
                </div>
                <div className="flex gap-6 text-sm font-medium text-slate-500">
                    <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
                </div>
                <p className="text-sm text-slate-400">
                    © {new Date().getFullYear()} University Campus Platform.
                </p>
            </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float 15s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 18s ease-in-out infinite reverse;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-down {
           animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Layout;