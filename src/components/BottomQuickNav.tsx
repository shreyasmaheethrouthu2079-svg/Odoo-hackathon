import React from 'react';
import { useHRMS } from '../context/HRMSContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  CalendarOff, 
  Users, 
  Banknote, 
  UserSquare2, 
  BarChart3,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';

export const BottomQuickNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    leaveRequests,
    todayAttendance,
    checkIn,
    checkOut,
  } = useHRMS();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending').length;
  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarClock,
      badge: null,
    },
    {
      id: 'leaves',
      label: 'Leaves',
      icon: CalendarOff,
      badge: isAdmin && pendingLeaves > 0 ? pendingLeaves : null,
    },
    {
      id: 'employees',
      label: 'Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: Banknote,
      badge: null,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserSquare2,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-indigo-300/80 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-indigo-500/10 rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-2 ring-1 ring-black/5 transition-all duration-300"
        >
          
          {/* Main Navigation Items */}
          <div className="flex items-center justify-between flex-1 gap-1 overflow-x-auto no-scrollbar py-0.5 px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`bottom-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative flex flex-col items-center justify-center py-1.5 px-2 sm:px-3 rounded-xl transition-all duration-200 cursor-pointer min-w-[52px] sm:min-w-[64px] ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/90 font-bold shadow-xs -translate-y-0.5 border border-indigo-200/60'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100/90 hover:-translate-y-1 hover:shadow-sm border border-transparent hover:border-slate-200/80'
                  }`}
                  title={item.label}
                >
                  {/* Active Indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute -top-1 w-7 h-1 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Icon with hover pop */}
                  <div className="relative">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                      isActive 
                        ? 'text-indigo-600 scale-110' 
                        : 'text-slate-500 group-hover:text-indigo-600 group-hover:scale-120 group-hover:-rotate-3'
                    }`} />
                    {item.badge !== null && (
                      <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-1 bg-amber-500 group-hover:bg-amber-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs transition-colors">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label with hover style */}
                  <span className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate max-w-[60px] transition-colors duration-200 ${
                    isActive 
                      ? 'font-bold text-indigo-700' 
                      : 'font-medium group-hover:font-semibold group-hover:text-indigo-600'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200 shrink-0" />

          {/* Quick Clock in/out Button with hover lift & glow */}
          <div className="shrink-0 flex items-center pl-1 sm:pl-0">
            {isCheckedIn ? (
              <button
                id="bottom-quick-checkout"
                onClick={checkOut}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 hover:scale-105 hover:shadow-md hover:shadow-amber-500/25 text-white px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
                title="Clock Out of active shift"
              >
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                <span className="hidden md:inline">Clock Out</span>
                <span className="md:hidden">Out</span>
              </button>
            ) : (
              <button
                id="bottom-quick-checkin"
                onClick={checkIn}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 hover:scale-105 hover:shadow-md hover:shadow-emerald-600/25 text-white px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
                title="Clock In for today"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Clock In</span>
                <span className="md:hidden">In</span>
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};
