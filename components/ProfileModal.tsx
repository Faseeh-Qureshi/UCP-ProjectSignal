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

  // Reusable Input Component for consistent high-quality UI
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-white/20">
        
        {/* Cinematic Cover Photo */}
        <div className="h-48 bg-slate-900 relative shrink-0 group">
             {/* Dynamic Gradient Background */}
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-ucp-navy to-slate-900 opacity-90"></div>
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
             
             {/* Controls */}
             <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-20">
                <X className="w-5 h-5" />
            </button>
            
            {activeTab === 'edit' && (
                <button className="absolute bottom-4 right-4 px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-2 transition-all border border-white/10 shadow-lg">
                    <Camera className="w-4 h-4" /> Edit Cover
                </button>
            )}
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            <div className="px-6 md:px-10 pb-10">
                
                {/* Header Section with Overlapping Avatar */}
                <div className="flex flex-col md:flex-row gap-6 items-end -mt-20 mb-10 relative z-10">
                    
                    {/* Avatar Group */}
                    <div className="relative group/avatar shrink-0 mx-auto md:mx-0">
                        <div 
                            onClick={handleAvatarClick}
                            onMouseEnter={() => setIsHoveringAvatar(true)}
                            onMouseLeave={() => setIsHoveringAvatar(false)}
                            className={`w-36 h-36 rounded-full p-1.5 bg-white shadow-2xl shadow-slate-900/20 overflow-hidden transition-transform duration-300 ${activeTab === 'edit' ? 'cursor-pointer hover:scale-105 hover:ring-4 hover:ring-ucp-navy/20' : ''}`}
                        >
                            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-ucp-navy text-5xl font-black border border-slate-200 overflow-hidden relative">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
                                ) : (
                                    formData.name.charAt(0)
                                )}
                                
                                {/* Edit Overlay */}
                                {activeTab === 'edit' && (
                                    <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                        <Camera className="w-8 h-8 text-white mb-1" />
                                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 text-center md:text-left mb-2 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2 font-display">
                                    {formData.name}
                                    {isFaculty && (
                                        <span title="Verified Faculty Member" className="text-emerald-500">
                                            <CheckCircle2 className="w-6 h-6 fill-current text-white" />
                                        </span>
                                    )}
                                </h1>
                                <p className="text-lg font-bold text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                                    {formData.designation || formData.role}
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <Building className="w-3.5 h-3.5" /> 
                                    {formData.departmentId ? formData.departmentId.replace('dept-', '').toUpperCase() : 'University Member'}
                                </div>
                            </div>
                            
                            {/* Mode Toggle */}
                            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full md:w-auto">
                                <button 
                                    onClick={() => setActiveTab('view')}
                                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 ${activeTab === 'view' ? 'bg-white text-ucp-navy shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 shadow-none'}`}
                                >
                                    <UserIcon className="w-3.5 h-3.5" /> View
                                </button>
                                <button 
                                    onClick={() => setActiveTab('edit')}
                                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'bg-white text-ucp-navy shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 shadow-none'}`}
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                {activeTab === 'view' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
                        {/* Left Column: Bio & Skills */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Bio Card */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-[2px] bg-ucp-crimson"></span> Professional Bio
                                </h3>
                                <p className="text-slate-700 leading-loose font-medium text-justify text-lg border-l-4 border-slate-100 pl-4">
                                    {formData.bio || <span className="text-slate-400 italic">No biography provided. Add one in edit mode to standout.</span>}
                                </p>
                            </div>

                            {/* Skills Card */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                     <span className="w-8 h-[2px] bg-ucp-navy"></span> {isFaculty ? 'Research Interests' : 'Core Competencies'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.expertise?.map((skill, i) => (
                                        <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                    {(!formData.expertise || formData.expertise.length === 0) && <span className="text-sm text-slate-400 italic">No skills listed.</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Contact & Socials</h3>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-3 group">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-ucp-crimson shadow-sm border border-slate-100 shrink-0"><Mail className="w-5 h-5"/></div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                            <p className="text-sm font-bold text-slate-800 truncate" title={formData.email}>{formData.email}</p>
                                        </div>
                                    </div>
                                    
                                    {isFaculty && formData.officeHours && (
                                        <div className="flex items-start gap-3 group">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-ucp-navy shadow-sm border border-slate-100 shrink-0"><Clock className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Office Hours</p>
                                                <p className="text-sm font-bold text-slate-800">{formData.officeHours}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                                        {formData.linkedInUrl && (
                                            <a href={`https://${formData.linkedInUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors text-slate-600 hover:text-blue-700 shadow-sm group">
                                                <Linkedin className="w-4 h-4" />
                                                <span className="text-xs font-bold">LinkedIn Profile</span>
                                                <Link className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
                                            </a>
                                        )}
                                        {formData.websiteUrl && (
                                            <a href={`https://${formData.websiteUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors text-slate-600 hover:text-slate-900 shadow-sm group">
                                                <Globe className="w-4 h-4" />
                                                <span className="text-xs font-bold">Portfolio Website</span>
                                                <Link className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Personal Information Group */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-lg bg-ucp-navy text-white flex items-center justify-center"><UserIcon className="w-4 h-4" /></div>
                                    <h3 className="text-lg font-bold text-slate-800">Identity Information</h3>
                                </div>
                                
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

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
                                    <textarea 
                                        rows={6}
                                        value={formData.bio || ''}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-ucp-navy focus:ring-4 focus:ring-ucp-navy/10 outline-none transition-all resize-none placeholder:text-slate-400"
                                        placeholder="Write a short professional biography..."
                                    />
                                </div>
                            </section>

                            {/* Right Column Group */}
                            <div className="space-y-8">
                                {/* Digital Presence */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-ucp-navy text-white flex items-center justify-center"><Globe className="w-4 h-4" /></div>
                                        <h3 className="text-lg font-bold text-slate-800">Digital Presence</h3>
                                    </div>

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
                                </section>

                                {isFaculty && (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                            <div className="w-8 h-8 rounded-lg bg-ucp-navy text-white flex items-center justify-center"><Clock className="w-4 h-4" /></div>
                                            <h3 className="text-lg font-bold text-slate-800">Availability</h3>
                                        </div>
                                        <FormInput 
                                            label="Office Hours" 
                                            icon={Clock}
                                            value={formData.officeHours || ''}
                                            onChange={(e: any) => setFormData({...formData, officeHours: e.target.value})}
                                            placeholder="e.g. Mon-Wed 11:00 AM - 1:00 PM"
                                        />
                                    </section>
                                )}

                                <div className="pt-8">
                                    <button type="submit" className="w-full py-4 bg-ucp-navy hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-ucp-navy/20 active:scale-[0.98] text-lg">
                                        <Save className="w-5 h-5" /> Save Changes
                                    </button>
                                </div>
                            </div>
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