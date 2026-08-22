import React, { useState } from 'react';
import { useHRMS } from '../context/HRMSContext';
import { Role } from '../types';
import { BrandLogo } from './common/BrandLogo';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  UserCheck, 
  BadgeCheck, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { login, signup, switchUser, allUsers } = useHRMS();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('alex.rivera@dayflow.io');
  const [signInPassword, setSignInPassword] = useState('Dayflow@2026');
  
  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmployeeId, setSignUpEmployeeId] = useState(`DF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<Role>('employee');
  const [signUpDesignation, setSignUpDesignation] = useState('');
  const [signUpDepartment, setSignUpDepartment] = useState('Engineering');
  
  // UI states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Password security validation rules
  const hasMinLength = signUpPassword.length >= 8;
  const hasNumber = /\d/.test(signUpPassword);
  const hasUpper = /[A-Z]/.test(signUpPassword);
  const isPasswordValid = hasMinLength && hasNumber && hasUpper;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(signInEmail, signInPassword);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please verify your email.');
      }
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 characters, include a number and an uppercase letter.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = signup({
        name: signUpName,
        employeeId: signUpEmployeeId,
        email: signUpEmail,
        role: signUpRole,
        designation: signUpDesignation || (signUpRole === 'admin' ? 'HR Operations Specialist' : 'Software Engineer'),
        department: signUpDepartment,
      });

      setLoading(false);
      if (res.success) {
        setEmailVerificationSent(true);
        setTimeout(() => {
          setEmailVerificationSent(false);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }, 500);
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header Ribbon Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-3">
            <BrandLogo className="w-14 h-14 shadow-lg shadow-black/20" rounded="rounded-2xl" />
          </div>
          <h2 className="text-xl font-extrabold tracking-wider uppercase">
            {mode === 'signin' ? 'WELCOME TO DAYFLOW' : 'CREATE DAYFLOW HRMS ACCOUNT'}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            {mode === 'signin' 
              ? 'Sign in to access your attendance, leaves, and records' 
              : 'Register your employee profile with role credentials'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {emailVerificationSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Email Verification Sent!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                A verification link has been dispatched to <span className="font-semibold text-slate-700">{signUpEmail}</span>. Redirecting to dashboard...
              </p>
            </div>
          ) : mode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@dayflow.io"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-indigo-600 font-medium cursor-pointer hover:underline">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Demo Account Quick Switcher */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
                  1-Click Demo Accounts
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr-admin-1')}
                    className="flex items-center space-x-2 p-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-purple-900 truncate">Sarada Prasad Dash</p>
                      <p className="text-[9px] text-purple-600 font-semibold uppercase">Admin / HR</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('usr-emp-1')}
                    className="flex items-center space-x-2 p-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-left transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-blue-900 truncate">Rohan Sharma</p>
                      <p className="text-[9px] text-blue-600 font-semibold uppercase">Employee</p>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={signUpEmployeeId}
                    onChange={(e) => setSignUpEmployeeId(e.target.value)}
                    placeholder="DF-1099"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="jordan.lee@dayflow.io"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role Allocation</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('employee')}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      signUpRole === 'employee' ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Employee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('admin')}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      signUpRole === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin / HR</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={signUpDepartment}
                    onChange={(e) => setSignUpDepartment(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={signUpDesignation}
                    onChange={(e) => setSignUpDesignation(e.target.value)}
                    placeholder="e.g. Backend Dev"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 8 chars, 1 number, 1 uppercase"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                {/* Security Rule Checklist */}
                <div className="mt-1.5 space-y-1 bg-slate-50 p-2 rounded-md text-[10px]">
                  <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span>Minimum 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span>Contains at least 1 number</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasUpper ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span>Contains at least 1 uppercase letter</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Creating account...' : 'Complete Registration'}</span>
                <BadgeCheck className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
