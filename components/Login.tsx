import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
        // Find a mock user for this role
        // For Faculty, we default to CS, but in a real app, auth determines this
        // We added a workaround in App.tsx to switch faculty for demo
        const user = MOCK_USERS.find(u => u.role === selectedRole);
        if (user) onLogin(user);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf9]">
      {/* Visual Side (Art) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-16">
            <h1 className="text-5xl font-serif text-white mb-6 leading-tight">
                Where <span className="italic text-indigo-300">Academic rigor</span> meets <br/> professional <span className="italic text-emerald-300">visibility</span>.
            </h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                The centralized platform for validating, curating, and showcasing final-year excellence across all disciplines.
            </p>
        </div>
      </div>

      {/* Functional Side (Science) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
            <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6">
                    <Building2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="mt-2 text-slate-500">Sign in to access the university signal platform.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Access Role</label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.values(UserRole).map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`p-3 text-sm font-bold rounded-xl border-2 transition-all duration-200 flex items-center justify-center
                                    ${selectedRole === role 
                                        ? 'border-slate-800 bg-slate-800 text-white shadow-md' 
                                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                                    }
                                `}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                Continue to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Institutional Access • SSO Enabled</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;