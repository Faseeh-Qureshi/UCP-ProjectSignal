import React, { useState, useRef, useEffect } from 'react';
import { UserRole, User, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import { LogOut, ChevronDown, Menu, X, Bell, MonitorPlay, Settings, Check, LayoutDashboard, Globe, Search } from 'lucide-react';
import ProfileModal from './ProfileModal';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  onRoleSwitch: (role: UserRole) => void;
  onUpdateUser: (user: User) => void;
  currentView: 'dashboard' | 'showcase';
  onNavigate: (view: 'dashboard' | 'showcase') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, onRoleSwitch, onUpdateUser, currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const isPublic = currentUser.role === UserRole.PUBLIC;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-x-hidden font-sans selection:bg-ucp-crimson/20 selection:text-ucp-crimson">
      
      {/* Global Noise Texture */}
      <div className="bg-texture"></div>

      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-100/30 rounded-full blur-[120px] mix-blend-multiply animate-float-slow"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px] mix-blend-multiply animate-float-delayed"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-slate-200/30 rounded-full blur-[100px] mix-blend-multiply animate-float-slow"></div>
      </div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-b border-ucp-navy/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"></div>
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ucp-navy to-ucp-crimson z-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-8">
                {/* Branding Section */}
                <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => { onNavigate('dashboard'); window.scrollTo(0,0); }}>
                <div className="relative h-12 w-auto flex items-center justify-center p-1">
                    <img 
                        src="https://ucp.edu.pk/inc/uploads/2019/06/ucp-sticky-logo-white-1.png" 
                        alt="UCP" 
                        className="h-full w-auto object-contain filter invert brightness-0" 
                        style={{filter: 'invert(0) brightness(0) saturate(100%)'}} 
                    /> 
                </div>
                <div className="hidden sm:flex flex-col h-10 justify-center border-l border-slate-300 pl-4">
                    <span className="font-serif font-black text-lg tracking-tight text-ucp-navy leading-none">Project<span className="text-ucp-crimson">Signal</span></span>
                    <span className="font-sans font-medium text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">Project Intelligence Platform</span>
                </div>
                </div>

                {/* Primary Navigation */}
                {!isPublic && (
                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                        <button 
                            onClick={() => onNavigate('dashboard')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${currentView === 'dashboard' ? 'bg-white text-ucp-navy shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> Workspace
                        </button>
                        <button 
                             onClick={() => onNavigate('showcase')}
                             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${currentView === 'showcase' ? 'bg-white text-ucp-crimson shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <Globe className="w-4 h-4" /> Global Explorer
                        </button>
                    </div>
                )}
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-6">
              
               {/* Notifications */}
               {!isPublic && (
                <div className="relative" ref={notifRef}>
                   <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2.5 rounded-full transition-all duration-300 ${isNotifOpen ? 'bg-ucp-crimson text-white' : 'text-slate-500 hover:text-ucp-crimson hover:bg-red-50'}`}
                   >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-ucp-crimson rounded-full border-2 border-white animate-pulse"></span>
                      )}
                   </button>
                   
                   {isNotifOpen && (
                       <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5 z-[100]">
                           <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                               <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                               <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-ucp-crimson hover:underline">Mark all read</button>
                           </div>
                           <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                               {notifications.length === 0 ? (
                                   <div className="p-8 text-center text-xs text-slate-400">No new alerts</div>
                               ) : (
                                   notifications.map(n => (
                                       <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-red-50/40' : ''}`}>
                                           <div className="flex items-start gap-3">
                                               <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-ucp-crimson' : 'bg-slate-300'}`}></div>
                                               <div>
                                                   <p className="text-xs font-bold text-slate-800 mb-0.5">{n.title}</p>
                                                   <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                                                   <span className="text-[10px] text-slate-400 mt-2 block">{new Date(n.timestamp).toLocaleDateString()}</span>
                                               </div>
                                           </div>
                                       </div>
                                   ))
                               )}
                           </div>
                       </div>
                   )}
               </div>
               )}

              {/* Role Switcher */}
              <div className="relative">
                  <button 
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 200)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-white transition-all py-2 px-4 rounded-full border border-slate-200 shadow-sm group hover:shadow-md hover:border-ucp-crimson/30"
                  >
                    <div className="flex items-center gap-1.5">
                        <MonitorPlay className="w-3 h-3 text-ucp-crimson" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-ucp-navy">View As:</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 min-w-[60px] text-left">{currentUser.role}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Custom Dropdown Menu */}
                  {isRoleDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/60 overflow-hidden animate-fade-in-down ring-1 ring-black/5 z-[100]">
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Simulation Mode
                        </div>
                        {Object.values(UserRole).map(role => (
                            <button 
                                key={role}
                                onClick={() => { onRoleSwitch(role); setIsRoleDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between
                                    ${currentUser.role === role ? 'bg-red-50 text-ucp-crimson' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                {role}
                                {currentUser.role === role && <Check className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>
                  )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200/60">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-ucp-navy leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{currentUser.departmentId?.replace('dept-', '').toUpperCase() || 'Guest'}</span>
                </div>
                <div className="relative group">
                    <button onClick={() => setIsProfileModalOpen(true)} className="h-10 w-10 rounded-full bg-gradient-to-br from-ucp-navy to-ucp-crimson p-[2px] shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                             {currentUser.avatarUrl ? (
                                <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" />
                             ) : (
                                <span className="font-bold text-ucp-navy text-sm">{currentUser.name.charAt(0)}</span>
                             )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <Settings className="w-3 h-3 text-slate-600" />
                        </div>
                    </button>
                </div>
                <button 
                    onClick={onLogout} 
                    className="p-2 text-slate-400 hover:text-ucp-crimson hover:bg-red-50 rounded-xl transition-all" 
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
                {!isPublic && (
                    <div className="flex gap-2">
                         <button 
                            onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${currentView === 'dashboard' ? 'bg-ucp-navy text-white' : 'bg-slate-100 text-slate-500'}`}
                        >
                            Workspace
                        </button>
                        <button 
                             onClick={() => { onNavigate('showcase'); setIsMobileMenuOpen(false); }}
                             className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${currentView === 'showcase' ? 'bg-ucp-crimson text-white' : 'bg-slate-100 text-slate-500'}`}
                        >
                            Explorer
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-ucp-crimson font-bold">
                             {currentUser.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{currentUser.name}</p>
                            <button onClick={() => setIsProfileModalOpen(true)} className="text-xs text-ucp-crimson font-bold">Edit Profile</button>
                        </div>
                    </div>
                    <button onClick={onLogout} className="text-xs font-bold text-ucp-crimson">Logout</button>
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
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${currentUser.role === role ? 'bg-red-50 text-ucp-crimson' : 'hover:bg-slate-50 text-slate-600'}`}
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
        <div className="absolute inset-0 bg-white/60 backdrop-blur-lg"></div>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3 opacity-80">
                     <div className="h-8 w-8 flex items-center justify-center">
                        <img 
                            src="https://ucp.edu.pk/inc/uploads/2019/06/ucp-sticky-logo-white-1.png" 
                            alt="UCP" 
                            className="h-full w-auto filter invert brightness-0"
                            style={{filter: 'invert(0) brightness(0)'}} 
                        />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">University of Central Punjab</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Lahore, Pakistan</span>
                     </div>
                </div>
                <div className="flex gap-6 text-sm font-medium text-slate-500">
                    <a href="#" className="hover:text-ucp-crimson transition-colors">About ProjectSignal</a>
                    <a href="#" className="hover:text-ucp-crimson transition-colors">Academic Policies</a>
                    <a href="#" className="hover:text-ucp-crimson transition-colors">Help Center</a>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                    © {new Date().getFullYear()} UCP. All rights reserved.
                </p>
            </div>
        </div>
      </footer>
      
      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal 
            user={currentUser} 
            onClose={() => setIsProfileModalOpen(false)} 
            onUpdateUser={onUpdateUser} 
        />
      )}
    </div>
  );
};

export default Layout;