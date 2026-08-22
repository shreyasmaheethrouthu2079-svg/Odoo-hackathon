import React, { useState } from 'react';
import { useHRMS } from '../context/HRMSContext';
import { BrandLogo } from './common/BrandLogo';
import { GlobalSearch } from './common/GlobalSearch';
import { 
  Building2, 
  ShieldCheck, 
  UserCircle2, 
  Clock, 
  Bell, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  ArrowRightLeft,
  UserCheck,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenNotifications }) => {
  const { 
    currentUser, 
    allUsers, 
    switchUser, 
    quickSwitchRole, 
    logout, 
    todayAttendance, 
    checkIn, 
    checkOut, 
    unreadNotificationsCount,
    setActiveTab,
    toggleSidebar,
    toggleMobileSidebar,
    isSidebarCollapsed
  } = useHRMS();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;

  const handleMenuClick = () => {
    toggleMobileSidebar();
  };

  return (
    <header id="dayflow-navbar" className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Corner: Logo & Brand */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <BrandLogo className="w-10 h-10 shadow-md shadow-sky-500/20" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold tracking-wider uppercase bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                    DAYFLOW
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider">
                    HRMS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block leading-none font-medium">
                  Every workday, perfectly aligned.
                </p>
              </div>
            </div>
          </div>

          {/* Upwards Search Bar */}
          {currentUser && (
            <div className="flex-1 flex justify-center max-w-lg mx-2">
              <GlobalSearch onOpenNotifications={onOpenNotifications} />
            </div>
          )}

          {/* Center/Right Status & Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            
            {currentUser ? (
              <>
                {/* Role Switcher Pill */}
                <div className="relative">
                  <button
                    id="role-switch-btn"
                    onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span className="capitalize hidden sm:inline">{currentUser.role === 'admin' ? 'HR Admin View' : 'Employee View'}</span>
                    <span className="capitalize sm:hidden">{currentUser.role === 'admin' ? 'HR' : 'Emp'}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                  </button>

                  <AnimatePresence>
                    {roleSwitcherOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800"
                      >
                        <div className="px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-100">
                          Toggle System Persona
                        </div>
                        <div className="space-y-1 mt-1">
                          <button
                            onClick={() => {
                              quickSwitchRole('admin');
                              setRoleSwitcherOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                              currentUser.role === 'admin' ? 'bg-purple-50 font-semibold text-purple-800' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="font-semibold">HR Officer / Admin</p>
                                <p className="text-[10px] text-slate-400">Full management, approvals & payroll</p>
                              </div>
                            </div>
                            {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                          </button>

                          <button
                            onClick={() => {
                              quickSwitchRole('employee');
                              setRoleSwitcherOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                              currentUser.role === 'employee' ? 'bg-blue-50 font-semibold text-blue-800' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="font-semibold">Regular Employee</p>
                                <p className="text-[10px] text-slate-400">Clock-in, apply leaves & view payslips</p>
                              </div>
                            </div>
                            {currentUser.role === 'employee' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notifications Bell */}
                <button
                  id="notifications-btn"
                  onClick={onOpenNotifications}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 bg-white transition-colors cursor-pointer"
                  title="Notifications & Alerts"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Right Side Menu Button (next to Notifications) */}
                <button
                  id="right-menu-btn"
                  onClick={handleMenuClick}
                  className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 bg-white shadow-2xs transition-all cursor-pointer active:scale-95"
                  title="Open Navigation Menu"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-bold hidden sm:inline text-slate-700">Menu</span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 bg-white"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                    />
                    <div className="text-left hidden lg:block pr-1">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{currentUser.employeeId}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800"
                      >
                        {/* Current User Info */}
                        <div className="p-3 border-b border-slate-100 bg-slate-50/70 rounded-lg mb-2">
                          <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-xs text-slate-500">{currentUser.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {currentUser.department}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                              {currentUser.designation}
                            </span>
                          </div>
                        </div>

                        {/* Switch Employee Quick List */}
                        <div className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center justify-between">
                          <span>Switch Account</span>
                          <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                        </div>
                        <div className="space-y-1 max-h-48 overflow-y-auto my-1">
                          {allUsers.map(user => (
                            <button
                              key={user.id}
                              onClick={() => {
                                switchUser(user.id);
                                setUserDropdownOpen(false);
                              }}
                              className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                                user.id === currentUser.id ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-md object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="truncate font-medium">{user.name}</p>
                                <p className="text-[10px] text-slate-400 truncate">{user.role.toUpperCase()} • {user.employeeId}</p>
                              </div>
                              {user.id === currentUser.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-slate-100 pt-2 mt-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveTab('profile');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <UserCircle2 className="w-4 h-4 text-slate-500" />
                            <span>My Profile & Documents</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
