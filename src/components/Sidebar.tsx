import React from 'react';
import { useHRMS } from '../context/HRMSContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  CalendarOff, 
  Users, 
  UserSquare2, 
  Banknote, 
  BarChart3, 
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    leaveRequests, 
    logout,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useHRMS();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'pending').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Overview & daily actions',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarClock,
      badge: null,
      description: isAdmin ? 'Daily/Weekly logs & clock' : 'My check-ins & weekly view',
    },
    {
      id: 'leaves',
      label: 'Leave & Time-Off',
      icon: CalendarOff,
      badge: isAdmin && pendingLeavesCount > 0 ? pendingLeavesCount : null,
      badgeColor: 'bg-amber-500 text-white',
      description: isAdmin ? 'Review & approvals' : 'Apply & track balance',
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: Users,
      badge: null,
      description: isAdmin ? 'Manage staff & records' : 'Colleague contacts',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: UserSquare2,
      badge: null,
      description: 'Personal, job & docs',
    },
    {
      id: 'payroll',
      label: 'Payroll & Salary',
      icon: Banknote,
      badge: null,
      description: isAdmin ? 'Structure & batch run' : 'Payslips & tax breakdown',
    },
    {
      id: 'analytics',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
      description: 'Workforce insights & trends',
    },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
      
      {/* Header with Close Action */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">
            Navigation Menu
          </span>
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close Navigation"
          aria-label="Close Navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Role Indicator Card */}
      <div className={`rounded-xl mb-3 border transition-all ${
        isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-3'
      } ${
        isAdmin 
          ? 'bg-gradient-to-br from-purple-50 via-indigo-50/50 to-purple-100/40 border-purple-200/70 text-purple-950'
          : 'bg-gradient-to-br from-blue-50 via-sky-50/50 to-indigo-50/40 border-blue-200/70 text-blue-950'
      }`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-2.5'}`}>
          <div 
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${
              isAdmin ? 'bg-purple-600 shadow-xs' : 'bg-blue-600 shadow-xs'
            }`}
            title={`${currentUser.name} (${isAdmin ? 'HR Admin' : 'Employee'})`}
          >
            {isAdmin ? 'HR' : 'EMP'}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {currentUser.role === 'admin' ? 'HR / Administrator' : 'Standard Employee'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`relative w-full flex items-center rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isSidebarCollapsed 
                  ? 'justify-center p-2.5' 
                  : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'text-indigo-950 bg-indigo-50/90 font-bold border border-indigo-200/70 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className={`flex items-center min-w-0 ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className={`p-1.5 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50'
                }`}>
                  <Icon className="w-4 h-4" />
                  {isSidebarCollapsed && item.badge !== null && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="text-left">
                    <p className="truncate">{item.label}</p>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <div className="flex items-center space-x-1.5">
                  {item.badge !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Help / Info & Logout */}
      <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
        {!isSidebarCollapsed ? (
          <>
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
              <div className="flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-tight">
                  <p className="font-semibold text-slate-800">Role-Based Access</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isAdmin 
                      ? 'You have full approval & management privileges.' 
                      : 'Your view is limited to your personal records.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out / Switch Account</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={logout}
              title="Log Out / Switch Account"
              className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <AnimatePresence>
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
          />

          {/* Slide-in drawer from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl p-4 overflow-y-auto"
          >
            {sidebarContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
