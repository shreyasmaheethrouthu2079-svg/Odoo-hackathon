import React, { useState, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { User } from '../../types';
import { 
  UserCircle2, 
  Briefcase, 
  Banknote, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Layers,
  Sparkles,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Link2
} from 'lucide-react';
import { motion } from 'motion/react';

const AVATAR_PRESETS = [
  { label: 'Default', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80' },
  { label: 'Executive', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80' },
  { label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
  { label: 'Analyst', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80' },
  { label: 'Creative', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80' },
  { label: 'Illustrated', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WorkdayHub' },
];

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    updateUserProfile, 
    selectedEmployeeId, 
    setSelectedEmployeeId 
  } = useHRMS();

  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'job' | 'salary' | 'documents'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [docPreviewModal, setDocPreviewModal] = useState<any | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [photoUpdateMessage, setPhotoUpdateMessage] = useState<string | null>(null);
  const [profileBarSearch, setProfileBarSearch] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Target user: If selectedEmployeeId is set (by admin inspecting another user), show that user. Otherwise currentUser.
  const targetUser: User = (selectedEmployeeId && allUsers.find(u => u.id === selectedEmployeeId)) || currentUser;

  // Edit form state
  const [formData, setFormData] = useState({
    name: targetUser.name,
    email: targetUser.email,
    phone: targetUser.phone,
    address: targetUser.address,
    designation: targetUser.designation,
    department: targetUser.department,
    workLocation: targetUser.workLocation,
    avatar: targetUser.avatar,
    emergencyName: targetUser.emergencyContact?.name || '',
    emergencyRelationship: targetUser.emergencyContact?.relationship || '',
    emergencyPhone: targetUser.emergencyContact?.phone || '',
    baseSalary: targetUser.salaryStructure.baseSalary,
    hra: targetUser.salaryStructure.hra,
    specialAllowance: targetUser.salaryStructure.specialAllowance,
  });

  // Sync formData when targetUser or isEditing changes
  useEffect(() => {
    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone,
      address: targetUser.address,
      designation: targetUser.designation,
      department: targetUser.department,
      workLocation: targetUser.workLocation,
      avatar: targetUser.avatar,
      emergencyName: targetUser.emergencyContact?.name || '',
      emergencyRelationship: targetUser.emergencyContact?.relationship || '',
      emergencyPhone: targetUser.emergencyContact?.phone || '',
      baseSalary: targetUser.salaryStructure.baseSalary,
      hra: targetUser.salaryStructure.hra,
      specialAllowance: targetUser.salaryStructure.specialAllowance,
    });
  }, [targetUser, isEditing]);

  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.9);
          callback(compressed);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.onerror = () => {
        callback(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleQuickAvatarChange = (file: File) => {
    processImageFile(file, (dataUrl) => {
      updateUserProfile(targetUser.id, { avatar: dataUrl });
      setFormData(prev => ({ ...prev, avatar: dataUrl }));
      setPhotoUpdateMessage('Profile photo updated successfully!');
      setTimeout(() => setPhotoUpdateMessage(null), 3500);
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdmin) {
      // Admin can update all fields
      updateUserProfile(targetUser.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        designation: formData.designation,
        department: formData.department,
        workLocation: formData.workLocation,
        avatar: formData.avatar,
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone,
        },
        salaryStructure: {
          ...targetUser.salaryStructure,
          baseSalary: Number(formData.baseSalary),
          hra: Number(formData.hra),
          specialAllowance: Number(formData.specialAllowance),
        },
      });
    } else {
      // Employee can edit limited fields (Section 3.3.2: phone, address, profile picture)
      updateUserProfile(targetUser.id, {
        phone: formData.phone,
        address: formData.address,
        avatar: formData.avatar,
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone,
        },
      });
    }

    setIsEditing(false);
  };

  const grossPay = targetUser.salaryStructure.baseSalary + targetUser.salaryStructure.hra + targetUser.salaryStructure.specialAllowance;
  const totalDeductions = targetUser.salaryStructure.providentFund + targetUser.salaryStructure.professionalTax + targetUser.salaryStructure.incomeTax;
  const netPay = grossPay - totalDeductions;

  return (
    <div id="profile-view" className="space-y-6">
      
      {/* HR Employee Profiles Quick Navigator Bar (Visible to Admin) */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900">HR Workforce Profiles Selector</h3>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                Viewing: {targetUser.name} ({targetUser.employeeId})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Filter employee profiles..."
                value={profileBarSearch}
                onChange={(e) => setProfileBarSearch(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg outline-hidden focus:ring-1 focus:ring-purple-500 w-44 bg-slate-50/50"
              />
              {selectedEmployeeId && (
                <button
                  onClick={() => setSelectedEmployeeId(null)}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  My Profile
                </button>
              )}
            </div>
          </div>

          {/* Horizontal scrollable employee avatar strip */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-0.5">
            {allUsers
              .filter(u => 
                u.name.toLowerCase().includes(profileBarSearch.toLowerCase()) ||
                u.employeeId.toLowerCase().includes(profileBarSearch.toLowerCase()) ||
                u.department.toLowerCase().includes(profileBarSearch.toLowerCase())
              )
              .map((u) => {
                const isSelected = targetUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedEmployeeId(u.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-left transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className={`text-xs font-bold truncate max-w-[110px] ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                        {u.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate max-w-[110px]">
                        {u.employeeId} • {u.department}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Hero Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer backdrop-blur-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isAdmin ? 'Edit All Details' : 'Edit Profile Info'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Editing</span>
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          {/* Quick Photo update banner notification if triggered */}
          {photoUpdateMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{photoUpdateMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative group">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white transition-transform group-hover:scale-[1.02]"
                />
                
                {/* Floating Quick Upload Camera Button on Avatar */}
                <label 
                  title="Change Profile Photo"
                  className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[1px]"
                >
                  <Camera className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-bold">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleQuickAvatarChange(file);
                    }}
                  />
                </label>

                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white z-10" title="Active Workforce"></span>
              </div>
              <div className="mb-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-slate-900">{targetUser.name}</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                    {targetUser.employeeId}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {targetUser.designation} • <span className="text-indigo-600 font-semibold">{targetUser.department}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-indigo-50 text-indigo-700 border border-indigo-200">
                {targetUser.role === 'admin' ? 'HR / Administrator' : 'Staff Employee'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                📍 {targetUser.workLocation}
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
            {[
              { id: 'personal', label: 'Personal Details', icon: UserCircle2 },
              { id: 'job', label: 'Job & Employment', icon: Briefcase },
              { id: 'salary', label: 'Salary Structure', icon: Banknote },
              { id: 'documents', label: 'Documents & Certificates', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content & Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Editing Profile Information</h3>
              <p className="text-xs text-slate-500">
                {isAdmin ? 'Admin Mode: Full editing privileges across all modules.' : 'Employee Mode: You can edit phone, address, and profile picture.'}
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Email</label>
              <input
                type="email"
                disabled={!isAdmin}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Editable)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Section: Profile Picture Manager */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Profile Photo</h4>
                    <p className="text-[11px] text-slate-500">Upload a headshot, drag & drop a file, choose a preset, or enter an image link</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const seed = `${formData.name || targetUser.name}-${Date.now()}`;
                    setFormData({ ...formData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}` });
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate Avatar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Visual Preview */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="relative mb-2">
                    <img
                      src={formData.avatar}
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md bg-slate-100"
                    />
                    <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Active Preview</span>
                  <p className="text-[10px] text-slate-400 text-center truncate max-w-[140px] mt-0.5">
                    {targetUser.name}
                  </p>
                </div>

                {/* Upload & Dropzone */}
                <div className="sm:col-span-8 space-y-3">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        processImageFile(file, (dataUrl) => {
                          setFormData({ ...formData, avatar: dataUrl });
                        });
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      isDragOver
                        ? 'border-indigo-500 bg-indigo-50/50'
                        : 'border-slate-300 hover:border-indigo-400 bg-white'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-slate-700">
                        <label className="font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer">
                          <span>Browse computer</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                processImageFile(file, (dataUrl) => {
                                  setFormData({ ...formData, avatar: dataUrl });
                                });
                              }
                            }}
                          />
                        </label>
                        <span className="text-slate-500"> or drag and drop image here</span>
                      </div>
                      <p className="text-[10px] text-slate-400">PNG, JPG, WEBP or SVG (auto-scaled for high resolution)</p>
                    </div>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-[11px] bg-white"
                      />
                    </div>
                    {formData.avatar !== targetUser.avatar && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: targetUser.avatar })}
                        className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shrink-0 font-medium cursor-pointer transition-colors"
                        title="Revert to previous photo"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Presets Gallery */}
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Or pick a professional avatar style:
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: preset.url })}
                      className={`group p-1 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.avatar === preset.url
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover mx-auto mb-1 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[9px] font-semibold text-slate-700 block truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address (Editable)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Title</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Admin Salary Edit Fields */}
            {isAdmin && (
              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wider">
                  Admin Salary Structure Control
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Base Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">HRA Allowance (₹)</label>
                    <input
                      type="number"
                      value={formData.hra}
                      onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Special Allowance (₹)</label>
                    <input
                      type="number"
                      value={formData.specialAllowance}
                      onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          
          {/* Section 1: Personal Details */}
          {activeSubTab === 'personal' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Contact details and verified emergency relationships</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{targetUser.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{targetUser.phone}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-3 md:col-span-2">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Home & Mailing Address</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{targetUser.address}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Emergency Contact Details
                </h4>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {targetUser.emergencyContact?.name || 'David Jenkins'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Relationship: <span className="font-semibold text-slate-700">{targetUser.emergencyContact?.relationship || 'Spouse'}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    {targetUser.emergencyContact?.phone || '+1 (555) 234-8902'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Job Details */}
          {activeSubTab === 'job' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Job & Employment Details</h3>
                <p className="text-xs text-slate-500">Organizational hierarchy, work mode and date of joining</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Designation</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{targetUser.designation}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{targetUser.department}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reporting Manager</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{targetUser.managerName || 'Elena Vance (Executive)'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date of Joining</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{targetUser.dateOfJoining}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Work Mode</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{targetUser.workLocation}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Employment Status</span>
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full-Time Active
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Salary Structure (Section 3.3.1 / 3.6.1 Read-only for employee) */}
          {activeSubTab === 'salary' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Salary Structure & Compensation Breakdown</h3>
                  <p className="text-xs text-slate-500">
                    {isAdmin ? 'Admin View: Full compensation components with edit privileges.' : 'Read-only monthly compensation overview.'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Net Take-Home</span>
                  <p className="text-xl font-bold text-emerald-600">₹{netPay.toLocaleString()} / mo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Earnings */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Monthly Earnings</span>
                    <span className="text-xs font-bold text-emerald-700">₹{grossPay.toLocaleString()}</span>
                  </h4>
                  <div className="space-y-2 text-xs divide-y divide-emerald-100">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">Base Salary</span>
                      <span className="font-semibold text-slate-900">₹{targetUser.salaryStructure.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-semibold text-slate-900">₹{targetUser.salaryStructure.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">Special & Performance Allowance</span>
                      <span className="font-semibold text-slate-900">₹{targetUser.salaryStructure.specialAllowance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Monthly Deductions</span>
                    <span className="text-xs font-bold text-rose-700">₹{totalDeductions.toLocaleString()}</span>
                  </h4>
                  <div className="space-y-2 text-xs divide-y divide-rose-100">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">Provident Fund (PF)</span>
                      <span className="font-semibold text-slate-900">₹{targetUser.salaryStructure.providentFund.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">Professional State Tax</span>
                      <span className="font-semibold text-slate-900">₹{targetUser.salaryStructure.professionalTax.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">Income Tax (TDS)</span>
                      <span className="font-semibold text-slate-900">₹{targetUser.salaryStructure.incomeTax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Section 4: Documents */}
          {activeSubTab === 'documents' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Employment Documents & Records</h3>
                <p className="text-xs text-slate-500">Verified contracts, identity certificates and tax onboarding forms</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {targetUser.documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {doc.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Uploaded {doc.uploadDate} • {doc.fileSize}</p>
                    
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setDocPreviewModal(doc)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => alert(`Downloading verified copy of "${doc.title}"...`)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Document Preview Modal */}
      {docPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden"
          >
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{docPreviewModal.title}</h3>
                <p className="text-xs text-slate-400">Category: {docPreviewModal.category} • {docPreviewModal.fileSize}</p>
              </div>
              <button
                onClick={() => setDocPreviewModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center bg-slate-50 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Verified Dayflow Digital Document</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  This document has been cryptographically signed and stored in the Dayflow HRMS repository on {docPreviewModal.uploadDate}.
                </p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-left text-xs font-mono text-slate-600 space-y-1">
                <p>DOC_ID: {docPreviewModal.id}</p>
                <p>EMPLOYEE: {targetUser.name} ({targetUser.employeeId})</p>
                <p>INTEGRITY: SHA-256 Verified</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end space-x-2 bg-white">
              <button
                onClick={() => setDocPreviewModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${docPreviewModal.title}...`);
                  setDocPreviewModal(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
