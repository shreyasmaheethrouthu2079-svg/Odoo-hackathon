import React, { useState, useRef, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { 
  Search, 
  X, 
  User, 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  Banknote, 
  Users, 
  BarChart3, 
  UserCircle2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  PlusCircle, 
  Bell,
  Command,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchProps {
  onOpenNotifications?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    allUsers,
    setActiveTab,
    setSelectedEmployeeId,
    quickSwitchRole,
    todayAttendance,
    checkIn,
    checkOut,
  } = useHRMS();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'employees' | 'pages' | 'actions'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;

  // Listen for global keyboard shortcut (Cmd+K or Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // System Pages Definition
  const SYSTEM_PAGES = [
    { id: 'dashboard', title: 'Workday Dashboard', category: 'pages', desc: 'Real-time daily hub, quick actions & metrics', icon: LayoutDashboard, tab: 'dashboard' },
    { id: 'attendance', title: 'Attendance & Timesheets', category: 'pages', desc: 'Clock-in logs, work hours, overtime & audits', icon: Clock, tab: 'attendance' },
    { id: 'leaves', title: 'Leave & Time-Off Management', category: 'pages', desc: 'Apply leaves, balance tracking & approvals', icon: CalendarDays, tab: 'leaves' },
    { id: 'payroll', title: 'Payroll & Compensation', category: 'pages', desc: 'Salary structures, deductions & payslip downloads', icon: Banknote, tab: 'payroll' },
    { id: 'employees', title: 'Employee Directory', category: 'pages', desc: 'Workforce contacts, roles & organization hierarchy', icon: Users, tab: 'employees' },
    { id: 'analytics', title: 'Workforce Analytics', category: 'pages', desc: 'Executive headcounts, attendance & leave statistics', icon: BarChart3, tab: 'analytics' },
    { id: 'profile', title: 'My Profile & Employment Details', category: 'pages', desc: 'Personal details, avatar, emergency contacts & bank details', icon: UserCircle2, tab: 'profile' },
  ];

  // Quick System Actions
  const QUICK_ACTIONS = [
    {
      id: 'act-clock',
      title: isCheckedIn ? 'End Shift (Clock Out)' : 'Start Workday (Clock In)',
      category: 'actions',
      desc: isCheckedIn ? 'Clock out and log completed work hours' : 'Clock in for today shift at Office',
      icon: Clock,
      badge: isCheckedIn ? 'Shift Active' : 'Ready',
      badgeColor: isCheckedIn ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
      action: () => {
        if (isCheckedIn) {
          checkOut();
        } else {
          checkIn('Office');
        }
        setIsOpen(false);
      }
    },
    {
      id: 'act-leave',
      title: 'Submit New Leave Request',
      category: 'actions',
      desc: 'Request Paid Time Off, Sick Leave, or Casual Leave',
      icon: CalendarDays,
      badge: 'Time Off',
      badgeColor: 'bg-blue-100 text-blue-800',
      action: () => {
        setActiveTab('leaves');
        setIsOpen(false);
      }
    },
    {
      id: 'act-payslip',
      title: 'Download Recent Payslip',
      category: 'actions',
      desc: 'View breakdown and electronic PDF/Print payslip',
      icon: Banknote,
      badge: 'Finance',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      action: () => {
        setActiveTab('payroll');
        setIsOpen(false);
      }
    },
    {
      id: 'act-avatar',
      title: 'Update Profile Photo',
      category: 'actions',
      desc: 'Upload photo, preset style, or generate illustrated avatar',
      icon: Camera,
      badge: 'Profile',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      action: () => {
        if (currentUser) setSelectedEmployeeId(currentUser.id);
        setActiveTab('profile');
        setIsOpen(false);
      }
    },
    {
      id: 'act-persona',
      title: currentUser?.role === 'admin' ? 'Switch to Employee Persona' : 'Switch to HR Admin Persona',
      category: 'actions',
      desc: 'Toggle between administrative and employee workflow views',
      icon: ShieldCheck,
      badge: 'Persona',
      badgeColor: 'bg-purple-100 text-purple-800',
      action: () => {
        quickSwitchRole(currentUser?.role === 'admin' ? 'employee' : 'admin');
        setIsOpen(false);
      }
    },
    ...(onOpenNotifications ? [{
      id: 'act-notifications',
      title: 'Open Notifications & Alerts',
      category: 'actions',
      desc: 'Review unread updates, approval notices, and system alerts',
      icon: Bell,
      badge: 'Alerts',
      badgeColor: 'bg-rose-100 text-rose-800',
      action: () => {
        onOpenNotifications();
        setIsOpen(false);
      }
    }] : [])
  ];

  // Filter Employees
  const matchingEmployees = allUsers.filter(u => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.employeeId.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.designation.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }).slice(0, 6);

  // Filter Pages
  const matchingPages = SYSTEM_PAGES.filter(p => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tab.toLowerCase().includes(q);
  });

  // Filter Actions
  const matchingActions = QUICK_ACTIONS.filter(a => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
  });

  // Combined Results based on selectedFilter
  const allResults = [
    ...(selectedFilter === 'all' || selectedFilter === 'employees' ? matchingEmployees.map(e => ({ type: 'employee' as const, data: e })) : []),
    ...(selectedFilter === 'all' || selectedFilter === 'pages' ? matchingPages.map(p => ({ type: 'page' as const, data: p })) : []),
    ...(selectedFilter === 'all' || selectedFilter === 'actions' ? matchingActions.map(a => ({ type: 'action' as const, data: a })) : []),
  ];

  const handleSelectResult = (item: typeof allResults[0]) => {
    if (item.type === 'employee') {
      setSelectedEmployeeId(item.data.id);
      setActiveTab('profile');
    } else if (item.type === 'page') {
      setActiveTab(item.data.tab);
    } else if (item.type === 'action') {
      item.data.action();
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md mx-2 sm:mx-4">
      {/* Search Input Bar */}
      <div 
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex items-center space-x-2 w-full px-3 py-1.5 rounded-xl border text-xs transition-all cursor-text ${
          isOpen
            ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
            : 'bg-slate-100/80 hover:bg-slate-100 border-slate-200/80 text-slate-500'
        }`}
      >
        <Search className={`w-4 h-4 shrink-0 ${isOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search team, pages, actions..."
          className="w-full bg-transparent border-none outline-hidden text-slate-800 placeholder-slate-400 text-xs font-medium"
        />

        {query ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center space-x-1 shrink-0 text-[10px] font-mono font-semibold text-slate-400 bg-white/80 border border-slate-200/80 px-1.5 py-0.5 rounded-md shadow-2xs">
            <span>⌘K</span>
          </div>
        )}
      </div>

      {/* Floating Dropdown Results Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 text-slate-800 min-w-[340px] sm:min-w-[420px]"
          >
            {/* Filter Category Chips */}
            <div className="flex items-center space-x-1.5 p-2.5 bg-slate-50/90 border-b border-slate-100 overflow-x-auto text-[11px]">
              {(['all', 'employees', 'pages', 'actions'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {filter === 'all' ? 'All Matches' : filter}
                </button>
              ))}
            </div>

            {/* Results Body */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
              {allResults.length === 0 ? (
                <div className="py-8 text-center px-4">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No results found for "{query}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Try searching by employee name, role, department, or module name like "payroll".
                  </p>
                </div>
              ) : (
                <>
                  {/* Employees Category */}
                  {(selectedFilter === 'all' || selectedFilter === 'employees') && matchingEmployees.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Employees & Team ({matchingEmployees.length})</span>
                        <Users className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingEmployees.map((emp) => (
                          <div
                            key={emp.id}
                            onClick={() => handleSelectResult({ type: 'employee', data: emp })}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/70 group transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-700">
                                    {emp.name}
                                  </p>
                                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                                    {emp.employeeId}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">
                                  {emp.designation} • <span className="font-medium text-slate-600">{emp.department}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-[11px] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 font-semibold pl-2">
                              <span>Profile</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HR Pages / Modules */}
                  {(selectedFilter === 'all' || selectedFilter === 'pages') && matchingPages.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>HR Modules & Navigation</span>
                        <LayoutDashboard className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingPages.map((page) => {
                          const Icon = page.icon;
                          return (
                            <div
                              key={page.id}
                              onClick={() => handleSelectResult({ type: 'page', data: page })}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/80 group transition-all cursor-pointer border border-transparent hover:border-slate-200"
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-700">
                                    {page.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {page.desc}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 shrink-0 uppercase tracking-wider">
                                Jump
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {(selectedFilter === 'all' || selectedFilter === 'actions') && matchingActions.length > 0 && (
                    <div>
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Quick Actions</span>
                        <Sparkles className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <div
                              key={action.id}
                              onClick={() => handleSelectResult({ type: 'action', data: action })}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-sky-50/70 group transition-all cursor-pointer border border-transparent hover:border-sky-100"
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-1.5">
                                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-800">
                                      {action.title}
                                    </p>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${action.badgeColor}`}>
                                      {action.badge}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {action.desc}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Keyboard Hint Bar */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Navigate with click or search query</span>
              <div className="flex items-center space-x-2">
                <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-600">Esc</kbd> to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
