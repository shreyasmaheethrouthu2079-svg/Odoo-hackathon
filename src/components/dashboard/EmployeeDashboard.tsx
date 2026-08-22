import React, { useState, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { 
  Clock, 
  Calendar, 
  CalendarOff, 
  User, 
  Banknote, 
  CheckCircle2, 
  ArrowUpRight, 
  AlertCircle, 
  Timer, 
  MapPin, 
  Laptop, 
  Building, 
  Send, 
  FileText,
  Sparkles,
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeDashboard: React.FC = () => {
  const { 
    currentUser, 
    todayAttendance, 
    checkIn, 
    checkOut, 
    leaveRequests, 
    payslips, 
    setActiveTab,
    notifications 
  } = useHRMS();

  const [workMode, setWorkMode] = useState<'Office' | 'Remote' | 'Hybrid'>('Remote');
  const [liveSeconds, setLiveSeconds] = useState(0);

  if (!currentUser) return null;

  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;

  // Live timer tick when clocked in
  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn && todayAttendance?.checkInTime) {
      const [h, m, s] = todayAttendance.checkInTime.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(h, m, s, 0);

      const updateElapsed = () => {
        const now = new Date();
        const diffInSec = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setLiveSeconds(diffInSec > 0 ? diffInSec : 0);
      };

      updateElapsed();
      interval = setInterval(updateElapsed, 1000);
    } else {
      setLiveSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, todayAttendance?.checkInTime]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // User's leaves
  const myLeaves = leaveRequests.filter(r => r.employeeId === currentUser.employeeId);
  const pendingLeaves = myLeaves.filter(r => r.status === 'pending');
  const latestPayslip = payslips.find(p => p.employeeId === currentUser.employeeId);

  return (
    <div id="employee-dashboard" className="space-y-6">
      
      {/* Welcome Banner with subtle gradient and modern SaaS style */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Dayflow Workday Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good day, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {currentUser.designation} • {currentUser.department} • <span className="font-mono text-indigo-200">{currentUser.employeeId}</span>
            </p>
          </div>

          {/* Quick Clock In/Out Hero Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-indigo-300" />
                <span>Today's Shift Timer</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isCheckedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
              }`}>
                {isCheckedIn ? 'ACTIVE' : todayAttendance?.checkOutTime ? 'COMPLETED' : 'NOT CLOCKED'}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white mb-3">
              {isCheckedIn ? formatTimer(liveSeconds) : todayAttendance?.checkOutTime ? `${todayAttendance.totalHours || 8} hrs logged` : '00:00:00'}
            </div>

            {isCheckedIn ? (
              <button
                onClick={checkOut}
                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Clock Out & Finish Shift</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {(['Remote', 'Office', 'Hybrid'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWorkMode(mode)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                        workMode === mode ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => checkIn(workMode)}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Clock In ({workMode})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4 Quick Access Cards as requested in Section 3.2.1 of PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Profile */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setActiveTab('profile')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Employee Profile</h3>
          <p className="text-xs text-slate-500 mt-1">View personal details, job roles, salary info & documents</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
            <span>Manage profile</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

        {/* Card 2: Attendance */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              todayAttendance?.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {todayAttendance?.status === 'present' ? 'Present' : 'Pending'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Attendance Log</h3>
          <p className="text-xs text-slate-500 mt-1">Daily & weekly punch records, check-in history, work mode</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
            <span>View weekly calendar</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

        {/* Card 3: Leave Requests */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setActiveTab('leaves')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CalendarOff className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used} Days Left
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Time-Off & Leaves</h3>
          <p className="text-xs text-slate-500 mt-1">Apply for paid, sick, or casual leave & track approval status</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700">
            <span>Apply new leave</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

        {/* Card 4: Payroll Summary */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setActiveTab('payroll')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
              {latestPayslip?.status === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Payroll & Payslips</h3>
          <p className="text-xs text-slate-500 mt-1">Read-only salary structure, deductions breakdown & slip download</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-600">
            <span>Download payslip</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Leave Balances + Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Leave Balance Tracker & Quick Apply */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leave Balances Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">My Leave Balances (2026)</h3>
                <p className="text-xs text-slate-500">Track accrued, consumed, and remaining time-off quotas</p>
              </div>
              <button
                onClick={() => setActiveTab('leaves')}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Apply for Leave</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Paid Leave */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white">
                <div className="flex items-center justify-between text-xs text-indigo-900 font-semibold mb-1">
                  <span>Paid Leave</span>
                  <span className="text-[10px] text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">Annual</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-2xl font-bold text-indigo-950">
                    {currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {currentUser.leaveBalance.paid.total} left</span>
                </div>
                <div className="w-full bg-indigo-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full" 
                    style={{ width: `${((currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used) / currentUser.leaveBalance.paid.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Sick Leave */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white">
                <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold mb-1">
                  <span>Sick Leave</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Medical</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-2xl font-bold text-emerald-950">
                    {currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {currentUser.leaveBalance.sick.total} left</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-1.5 rounded-full" 
                    style={{ width: `${((currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used) / currentUser.leaveBalance.sick.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Unpaid / Casual */}
              <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex items-center justify-between text-xs text-slate-800 font-semibold mb-1">
                  <span>Unpaid / Casual</span>
                  <span className="text-[10px] text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">Emergency</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {currentUser.leaveBalance.unpaid.total - currentUser.leaveBalance.unpaid.used}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {currentUser.leaveBalance.unpaid.total} left</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-slate-700 h-1.5 rounded-full" 
                    style={{ width: `${((currentUser.leaveBalance.unpaid.total - currentUser.leaveBalance.unpaid.used) / currentUser.leaveBalance.unpaid.total) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* Active Requests List */}
            {pendingLeaves.length > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-amber-900">Pending Leave Approval</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700">{pendingLeaves.length} in queue</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {pendingLeaves.map(leave => (
                    <div key={leave.id} className="text-xs text-amber-800 flex items-center justify-between bg-white/70 px-2.5 py-1.5 rounded-lg border border-amber-100">
                      <span>{leave.leaveType.toUpperCase()} ({leave.daysCount} days): {leave.startDate} to {leave.endDate}</span>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Under HR Review</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Workday Policy Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50/40 rounded-2xl border border-sky-100 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Upcoming Company Holiday: Labor Day</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Monday, Sept 07 • Organization-wide paid day off</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View Calendar →
            </button>
          </div>

        </div>

        {/* Right 1 Col: Recent Activities & Alerts Stream */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Activity & Alerts</h3>
              </div>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-xl border transition-all ${
                    !notif.read ? 'bg-indigo-50/40 border-indigo-200/70' : 'bg-slate-50/60 border-slate-200/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setActiveTab('profile')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View Full Logs & Documents →
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
