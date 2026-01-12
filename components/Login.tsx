import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { ChevronRight, GraduationCap, ShieldCheck, Users, Lock, CheckCircle2, Server, Terminal } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
        const user = MOCK_USERS.find(u => u.role === selectedRole);
        if (user) onLogin(user);
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-slate-900">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: "url('https://horizon.ucp.edu.pk/aarsol_custom_loginpage/static/img/ucp_bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ucp-navy/95 to-ucp-crimson/90 mix-blend-multiply"></div>
        {/* Subtle animated noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row h-screen">
          
          {/* Left Column: Brand & Vision */}
          <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-20 text-white relative overflow-hidden">
              {/* Decorative Circle */}
              <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <img 
                        src="https://ucp.edu.pk/inc/uploads/2019/06/ucp-sticky-logo-white-1.png" 
                        alt="UCP Logo" 
                        className="h-16"
                    />
                    <div className="h-12 w-px bg-white/20"></div>
                    <div className="flex flex-col">
                         <span className="text-xl font-bold tracking-tight">Horizon</span>
                         <span className="text-xs uppercase tracking-[0.2em] opacity-70">Identity Provider</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-w-2xl animate-fade-in-up">
                      <span className="inline-block px-3 py-1 bg-ucp-gold/20 backdrop-blur-md rounded-full text-ucp-gold text-xs font-bold tracking-[0.2em] uppercase border border-ucp-gold/30">
                          Project Intelligence Platform
                      </span>
                      <h1 className="text-7xl font-serif font-bold leading-none tracking-tight text-white">
                          Project<span className="text-white/40">Signal</span>
                      </h1>
                      <p className="text-2xl text-white/70 mt-6 font-light leading-relaxed">
                          Where academic excellence meets verifiable proof of work. 
                          <span className="block text-white mt-2 font-medium">Your work, your signal.</span>
                      </p>
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-6 relative z-10">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <GraduationCap className="w-8 h-8 text-ucp-gold mb-4" />
                      <h3 className="font-bold text-white text-base">Student Portfolios</h3>
                      <p className="text-sm text-white/50 mt-2 leading-relaxed">Showcase applied skills beyond static transcripts.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <ShieldCheck className="w-8 h-8 text-ucp-gold mb-4" />
                      <h3 className="font-bold text-white text-base">Faculty Verified</h3>
                      <p className="text-sm text-white/50 mt-2 leading-relaxed">Endorsed competencies and validated outcomes.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <Users className="w-8 h-8 text-ucp-gold mb-4" />
                      <h3 className="font-bold text-white text-base">Industry Ready</h3>
                      <p className="text-sm text-white/50 mt-2 leading-relaxed">Connecting top talent with corporate opportunity.</p>
                  </div>
              </div>
              
              <div className="text-xs text-white/30 flex gap-6 mt-8">
                  <span>© {new Date().getFullYear()} University of Central Punjab</span>
                  <span>System Version 2.4.0 (Stable)</span>
                  <span>Privacy Policy</span>
              </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-white/5 lg:bg-[#f8fafc]">
             <div className="bg-white rounded-[2rem] shadow-2xl p-8 sm:p-12 w-full max-w-[440px] border border-slate-200 relative overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-ucp-navy to-ucp-crimson"></div>

                <div className="text-center mb-10">
                     <div className="h-16 w-16 mx-auto bg-ucp-navy rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-ucp-navy/20 rotate-3">
                        <GraduationCap className="text-white w-8 h-8"/>
                     </div>

                    <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">Institutional Sign In</h2>
                    <p className="text-slate-500 text-sm">Welcome back. Please authenticate to access the ProjectSignal network.</p>
                </div>

                {/* Microsoft Login Button Style */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#2F2F2F] hover:bg-black text-white p-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-transparent active:scale-[0.98] mb-8"
                >
                    {loading ? (
                        <span className="text-sm font-bold animate-pulse">Verifying Credentials...</span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"></rect><rect x="1" y="11" width="9" height="9" fill="#00a4ef"></rect><rect x="11" y="1" width="9" height="9" fill="#7fba00"></rect><rect x="11" y="11" width="9" height="9" fill="#ffb900"></rect></svg>
                            <span className="text-sm font-bold">Sign in with Microsoft 365</span>
                        </>
                    )}
                </button>
                
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-400 font-bold tracking-wider">Demo Configuration</span>
                    </div>
                </div>

                {/* Role Simulator (Styled as Dev Tools) */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Terminal className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Role Simulation Controller</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(UserRole).map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`flex items-center justify-center p-2.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
                                    selectedRole === role 
                                    ? 'bg-white border-ucp-navy text-ucp-navy shadow-sm' 
                                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Lock className="w-3 h-3" />
                        <span>Secured by UCP Horizon SSO</span>
                    </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Login;