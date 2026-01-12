import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { X, Save, User as UserIcon, Link, Briefcase, Mail, MapPin, Building, GraduationCap, Clock, Award, CheckCircle2, Camera, Upload, Github, Linkedin, Globe, Edit2 } from 'lucide-react';
import { useToast } from './ToastContext';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [formData, setFormData] = useState<User>({ ...user });
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    showToast("Profile updated successfully", "success");
    setActiveTab('view');
  };

  const handleAvatarClick = () => {
    if (activeTab === 'edit' && fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setFormData({...formData, avatarUrl: url});
          showToast("Photo updated", "success");
      }
  };

  const isFaculty = user.role === UserRole.FACULTY;

  // Reusable Input Component
  const FormInput = ({ label, icon: Icon, value, onChange, placeholder, required = false }: any) => (
      <div className="space-y-1.5 w-full">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ucp-navy transition-colors">
                  <Icon className="w-4 h-4" />
              </div>
              <input 
                  type="text" 
                  value={value}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-ucp-navy focus:ring-4 focus:ring-ucp-navy/10 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                  placeholder={placeholder}
                  required={required}
              />
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Container */}
      <div className="relative w-full sm:max-w-4xl max-h-[92vh] h-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 font-sans border border-white/20">
        
        {/* Sticky Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white w-full relative">
            
            {/* Cinematic Cover Photo */}
            <div className="h-32 sm:h-52 bg-slate-900 relative w-full group shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-ucp-navy to-slate-900 opacity-90"></div>
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                 
                 {activeTab === 'edit' && (
                    <button className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg text-[10px] font-bold backdrop-blur-md flex items-center gap-2 transition-all border border-white/10 shadow-lg z-20">
                        <Camera className="w-3.5 h-3.5" /> Edit Cover
                    </button>
                )}
            </div>

            {/* Main Content Wrapper */}
            <div className="px-6 sm:px-10 pb-12">
                
                {/* Header Grid: Decoupled Avatar & Text to prevent overlap */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    
                    {/* Column 1: Avatar (Negative Margin to pull up) */}
                    <div className="-mt-16 sm:-mt-20 shrink-0 flex justify-center md:justify-start z-10 relative">
                        <div className="relative group/avatar">
                            <div 
                                onClick={handleAvatarClick}
                                onMouseEnter={() => setIsHoveringAvatar(true)}
                                onMouseLeave={() => setIsHoveringAvatar(false)}
                                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-white bg-white shadow-xl shadow-slate-900/10 overflow-hidden transition-transform duration-300 ${activeTab === 'edit' ? 'cursor-pointer hover:scale-105 hover:ring-4 hover:ring-ucp-navy/20' : ''}`}
                            >
                                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-ucp-navy text-4xl sm:text-5xl font-black overflow-hidden relative">
                                    {formData.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
                                    ) : (
                                        formData.name.charAt(0)
                                    )}
                                    
                                    {/* Edit Overlay */}
                                    {activeTab === 'edit' && (
                                        <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                            <Camera className="w-6 h-6 text-white mb-1" />
                                            <span className="text-[9px] text-white font-bold uppercase tracking-wider">Change</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Column 2: Info & Actions (Normal Flow) */}
                    <div className="flex-1 pt-2 sm:pt-4 min-w-0">
                         <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">
                             
                             {/* Name Block */}
                             <div className="text-center md:text-left order-2 md:order-1 flex-1 min-w-0">
                                 <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-3 font-display leading-tight">
                                    <span className="truncate max-w-full">{formData.name}</span>
                                    {isFaculty && (
                                        <span title="Verified Faculty Member" className="text-emerald-500 mb-1">
                                            <CheckCircle2 className="w-6 h-6 fill-current text-white" />
                                        </span>
                                    )}
                                </h1>
                                <p className="text-sm sm:text-lg font-bold text-slate-500 mt-1">
                                    {formData.designation || formData.role}
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                        <Building className="w-3.5 h-3.5 text-slate-400" /> 
                                        {formData.departmentId ? formData.departmentId.replace('dept-', '').toUpperCase() : 'UCP Member'}
                                    </span>
                                </div>
                             </div>

                             {/* Actions Block */}
                             <div className="flex justify-center md:justify-end gap-2 order-1 md:order-2 w-full md:w-auto">
                                <button 
                                    onClick={() => setActiveTab('view')}
                                    className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 border ${activeTab === 'view' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'}`}
                                >
                                    <UserIcon className="w-3.5 h-3.5" /> View
                                </button>
                                <button 
                                    onClick={() => setActiveTab('edit')}
                                    className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 border ${activeTab === 'edit' ? 'bg-ucp-navy text-white border-ucp-navy shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'}`}
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Content Tabs */}
                {activeTab === 'view' ? (
                    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
                        {/* Bio Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="w-6 h-[2px] bg-ucp-crimson"></span> Professional Bio
                            </h3>
                            <div className="text-slate-700 leading-loose font-medium text-justify text-sm sm:text-base">
                                {formData.bio || <span className="text-slate-400 italic">No biography provided. Add one in edit mode to standout.</span>}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <span className="w-6 h-[2px] bg-ucp-navy"></span> {isFaculty ? 'Research Interests' : 'Core Competencies'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.expertise?.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                                {(!formData.expertise || formData.expertise.length === 0) && <span className="text-sm text-slate-400 italic">No skills listed.</span>}
                            </div>
                        </div>

                        {/* Contact Information (Grid Layout on Mobile) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Direct Contact</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-ucp-crimson shadow-sm border border-slate-100 shrink-0"><Mail className="w-5 h-5"/></div>
                                        <div className="overflow-hidden min-w-0">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                            <p className="text-sm font-bold text-slate-800 truncate" title={formData.email}>{formData.email}</p>
                                        </div>
                                    </div>
                                    {isFaculty && formData.officeHours && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-ucp-navy shadow-sm border border-slate-100 shrink-0"><Clock className="w-5 h-5"/></div>
                                            <div className="overflow-hidden min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Office Hours</p>
                                                <p className="text-sm font-bold text-slate-800 truncate">{formData.officeHours}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Digital Presence</h3>
                                <div className="space-y-3">
                                    {formData.linkedInUrl && (
                                        <a href={`https://${formData.linkedInUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors text-slate-600 hover:text-blue-700 shadow-sm group">
                                            <Linkedin className="w-4 h-4 shrink-0" />
                                            <span className="text-xs font-bold truncate">LinkedIn Profile</span>
                                            <Link className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
                                        </a>
                                    )}
                                    {formData.websiteUrl && (
                                        <a href={`https://${formData.websiteUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors text-slate-600 hover:text-slate-900 shadow-sm group">
                                            <Globe className="w-4 h-4 shrink-0" />
                                            <span className="text-xs font-bold truncate">Portfolio Website</span>
                                            <Link className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
                                        </a>
                                    )}
                                    {!formData.linkedInUrl && !formData.websiteUrl && (
                                        <div className="text-xs text-slate-400 italic p-1">No social links added.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                        
                        {/* Identity Group */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="w-6 h-6 rounded bg-ucp-navy text-white flex items-center justify-center"><UserIcon className="w-3.5 h-3.5" /></div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Basic Info</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput 
                                    label="Full Name" 
                                    icon={UserIcon}
                                    value={formData.name}
                                    onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                                    required
                                />

                                <FormInput 
                                    label={isFaculty ? 'Title / Designation' : 'Current Status'} 
                                    icon={Award}
                                    value={formData.designation || ''}
                                    onChange={(e: any) => setFormData({...formData, designation: e.target.value})}
                                    placeholder="e.g. Associate Professor"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
                                <textarea 
                                    rows={4}
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-ucp-navy focus:ring-4 focus:ring-ucp-navy/10 outline-none transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Write a short professional biography..."
                                />
                            </div>
                        </section>

                        {/* Links Group */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="w-6 h-6 rounded bg-ucp-navy text-white flex items-center justify-center"><Globe className="w-3.5 h-3.5" /></div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Socials & Contact</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput 
                                    label="LinkedIn Profile" 
                                    icon={Linkedin}
                                    value={formData.linkedInUrl || ''}
                                    onChange={(e: any) => setFormData({...formData, linkedInUrl: e.target.value})}
                                    placeholder="linkedin.com/in/username"
                                />
                                
                                <FormInput 
                                    label="Website / Portfolio" 
                                    icon={Link}
                                    value={formData.websiteUrl || ''}
                                    onChange={(e: any) => setFormData({...formData, websiteUrl: e.target.value})}
                                    placeholder="www.yourportfolio.com"
                                />

                                {isFaculty && (
                                    <FormInput 
                                        label="Office Hours" 
                                        icon={Clock}
                                        value={formData.officeHours || ''}
                                        onChange={(e: any) => setFormData({...formData, officeHours: e.target.value})}
                                        placeholder="e.g. Mon-Wed 11-1"
                                    />
                                )}
                            </div>
                        </section>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-3.5 bg-ucp-navy hover:bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-ucp-navy/20 active:scale-[0.98] text-sm sm:text-base">
                                <Save className="w-4 h-4" /> Save Profile Changes
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;