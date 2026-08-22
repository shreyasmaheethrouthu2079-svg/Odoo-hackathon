import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Role } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle,
  KeyRound,
  Sparkles,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SignUpStartingViewProps {
  onSignInSuccess?: () => void;
}

export const SignUpStartingView: React.FC<SignUpStartingViewProps> = ({ onSignInSuccess }) => {
  const { signup, login, switchUser, setActiveTab, allUsers } = useHRMS();

  // Mode: 'signin' | 'signup'
  const [tabMode, setTabMode] = useState<'signin' | 'signup'>('signin');

  // Selected Role Option: 'admin' (HR) vs 'employee' (Employee)
  const [activeRole, setActiveRole] = useState<Role>('admin');

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('sarada.dash@dayflow.io');
  const [signInPassword, setSignInPassword] = useState('Dayflow@2026');

  // Sign Up inputs
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('DF-HR101');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Human Resources');
  const [designation, setDesignation] = useState('HR Operations Manager');

  // State messages
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<{ role: Role; name: string } | null>(null);

  // Switch role inside the single window
  const handleRoleToggle = (role: Role) => {
    setActiveRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setSignInEmail('sarada.dash@dayflow.io');
      setSignInPassword('Dayflow@2026');
      setDepartment('Human Resources');
      setDesignation('HR Operations Manager');
      setEmployeeId('DF-HR' + Math.floor(100 + Math.random() * 900));
    } else {
      setSignInEmail('rohan.sharma@dayflow.io');
      setSignInPassword('Dayflow@2026');
      setDepartment('Engineering');
      setDesignation('Senior Software Engineer');
      setEmployeeId('DF-EMP' + Math.floor(100 + Math.random() * 900));
    }
  };

  // Sign In Handler
  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(signInEmail, signInPassword);
      setLoading(false);

      if (res.success) {
        const found = allUsers.find(u => u.email.toLowerCase() === signInEmail.toLowerCase());
        const userRole = found?.role || activeRole;
        setSuccessRedirect({ role: userRole, name: found?.name || (userRole === 'admin' ? 'Sarada Prasad Dash' : 'Rohan Sharma') });
        setActiveTab('dashboard');
        setTimeout(() => {
          onSignInSuccess?.();
        }, 800);
      } else {
        setErrorMsg(res.error || 'Invalid credentials for this account.');
      }
    }, 500);
  };

  // Quick 1-Click direct sign-in for the active role
  const handleQuickSignIn = (role: Role) => {
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      if (role === 'admin') {
        switchUser('usr-admin-1');
        setActiveTab('dashboard');
        setSuccessRedirect({ role: 'admin', name: 'Sarada Prasad Dash' });
      } else {
        switchUser('usr-emp-1');
        setActiveTab('dashboard');
        setSuccessRedirect({ role: 'employee', name: 'Rohan Sharma' });
      }
      setLoading(false);
      setTimeout(() => {
        onSignInSuccess?.();
      }, 700);
    }, 450);
  };

  // Sign Up Handler
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = signup({
        name: fullName,
        email: workEmail,
        employeeId: employeeId || `DF-${Math.floor(1000 + Math.random() * 9000)}`,
        role: activeRole,
        department: department,
        designation: designation || (activeRole === 'admin' ? 'HR Operations Manager' : 'Software Engineer'),
      });

      setLoading(false);

      if (res.success) {
        setSuccessRedirect({ role: activeRole, name: fullName });
        setActiveTab('dashboard');
        setTimeout(() => {
          onSignInSuccess?.();
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Success Overlay */}
      <AnimatePresence>
        {successRedirect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
          >
            <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                successRedirect.role === 'admin' 
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' 
                  : 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
              }`}>
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Welcome, {successRedirect.name}!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {successRedirect.role === 'admin' 
                    ? 'Entering HR Admin Management Dashboard' 
                    : 'Entering Employee Workspace & Self-Service Portal'}
                </p>
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 animate-pulse">
                <span>Directing to {successRedirect.role === 'admin' ? 'HR Page' : 'Employee Page'}...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Single Authentication Window */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo className="w-12 h-12 shadow-lg shadow-indigo-500/15" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">DAYFLOW HRMS</h1>
        </div>

        {/* 1. Primary Option Selector: Sign In with HR vs Sign In with Employee */}
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
            
            {/* Option 1: HR Admin */}
            <button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeRole === 'admin' ? 'text-purple-100' : 'text-slate-500'}`} />
              <span>HR Admin</span>
            </button>

            {/* Option 2: Employee */}
            <button
              type="button"
              onClick={() => handleRoleToggle('employee')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'employee'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeRole === 'employee' ? 'text-sky-100' : 'text-slate-500'}`} />
              <span>Employee</span>
            </button>

          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN FORM */}
        {tabMode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer mt-4 ${
                activeRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25'
              }`}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => { setTabMode('signup'); setErrorMsg(null); }}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium transition-colors underline cursor-pointer"
              >
                Need a new account? Register here
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-1">
              <span className="font-bold text-slate-800">Create New {activeRole === 'admin' ? 'HR' : 'Employee'} Profile</span>
              <button
                type="button"
                onClick={() => { setTabMode('signin'); setErrorMsg(null); }}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder={activeRole === 'admin' ? 'e.g. Priya Sharma' : 'e.g. Alex Rivera'}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!workEmail) {
                      setWorkEmail(`${e.target.value.toLowerCase().replace(/\s+/g, '.')}@dayflow.io`);
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 font-mono outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@dayflow.io"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer mt-4 ${
                activeRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25'
              }`}
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Secure Role-Based Access Control • Dayflow HRMS
          </p>
        </div>

      </motion.div>

    </div>
  );
};
