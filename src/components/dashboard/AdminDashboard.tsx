import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { User } from '../../types';
import { EmployeeDossierModal } from '../employees/EmployeeDossierModal';
import { 
  Users, 
  UserCheck, 
  CalendarClock, 
  CalendarOff, 
  Banknote, 
  Check, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Eye,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { 
    allUsers, 
    attendanceRecords, 
    leaveRequests, 
    payslips, 
    switchUser, 
    adminReviewLeave, 
    setActiveTab,
    setSelectedEmployeeId 
  } = useHRMS();

  const [reviewComment, setReviewComment] = useState<{ [key: string]: string }>({});
  const [dossierUser, setDossierUser] = useState<User | null>(null);
  const [profileSearch, setProfileSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const todayDateStr = '2026-08-22';
  const todayAttendance = attendanceRecords.filter(r => r.date === todayDateStr);
  const presentCount = todayAttendance.filter(r => r.status === 'present' || r.status === 'half-day').length;
  const onLeaveTodayCount = todayAttendance.filter(r => r.status === 'leave').length;

  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending');
  
  // Total Monthly Payroll calculation
  const totalPayroll = allUsers.reduce((sum, u) => {
    const gross = u.salaryStructure.baseSalary + u.salaryStructure.hra + u.salaryStructure.specialAllowance;
    const deductions = u.salaryStructure.providentFund + u.salaryStructure.professionalTax + u.salaryStructure.incomeTax;
    return sum + (gross - deductions);
  }, 0);

  const handleApprove = (reqId: string) => {
    adminReviewLeave(reqId, 'approved', reviewComment[reqId] || 'Approved by HR Administrator.');
  };

  const handleReject = (reqId: string) => {
    adminReviewLeave(reqId, 'rejected', reviewComment[reqId] || 'Rejected due to operational constraints.');
  };

  return (
    <div id="admin-dashboard" className="space-y-6">
      
      {/* Admin Executive Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-purple-900/50"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold backdrop-blur-md border border-purple-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>HR Management & Executive Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              HR Operations Overview ⚡
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Real-time monitoring across {allUsers.length} staff members, attendance synchronization, leave approvals, and payroll control.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('employees')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Banknote className="w-4 h-4" />
              <span>Run Payroll</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Staff</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{allUsers.length}</span>
            <span className="text-xs font-semibold text-emerald-600">+1 this month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active full-time & remote employees</p>
        </div>

        {/* Metric 2: Today's Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today Present</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{presentCount} / {allUsers.length}</span>
            <span className="text-xs font-semibold text-slate-500">({Math.round((presentCount / allUsers.length) * 100)}%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{onLeaveTodayCount} on approved leave today</p>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Leaves</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarOff className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{pendingLeaves.length}</span>
            <span className="text-xs font-semibold text-amber-600">Requires review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Time-off requests awaiting action</p>
        </div>

        {/* Metric 4: Monthly Payroll Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Monthly Payroll</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">₹{totalPayroll.toLocaleString()}</span>
            <span className="text-xs font-semibold text-purple-600">Disbursed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Standard monthly compensation cycle</p>
        </div>

      </div>

      {/* Main Grid: Pending Approvals Inbox + Employee Quick Switcher Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Actionable Leave Approvals */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Leave Approval Inbox</h3>
                <p className="text-xs text-slate-500">One-click approve or reject with custom feedback</p>
              </div>
              <button
                onClick={() => setActiveTab('leaves')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View all requests ({leaveRequests.length}) →
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">All leave requests reviewed!</p>
                <p className="text-[11px] text-slate-400">No pending time-off approvals in the queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <img src={req.employeeAvatar} alt={req.employeeName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{req.employeeName}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {req.department} • <span className="font-mono">{req.employeeId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                          {req.leaveType} Leave
                        </span>
                        <p className="text-[11px] font-semibold text-slate-700 mt-1">
                          {req.daysCount} Day(s) • {req.startDate} to {req.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-white/80 border border-amber-100 text-xs text-slate-700">
                      <span className="font-semibold text-slate-500">Reason: </span>
                      <span>"{req.remarks}"</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add remarks or notes (optional)..."
                        value={reviewComment[req.id] || ''}
                        onChange={(e) => setReviewComment({ ...reviewComment, [req.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Live Attendance Roster */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Workforce Attendance ({todayDateStr})</h3>
                <p className="text-xs text-slate-500">Live employee check-in status and work location</p>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Full Attendance Board →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Employee</th>
                    <th className="pb-2.5">Department</th>
                    <th className="pb-2.5">Punch In</th>
                    <th className="pb-2.5">Mode</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((user) => {
                    const record = attendanceRecords.find(r => r.employeeId === user.employeeId && r.date === todayDateStr);
                    const status = record ? record.status : 'absent';
                    const checkInTime = record?.checkInTime || '--:--';
                    const mode = record?.workMode || user.workLocation;

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5">
                          <div className="flex items-center space-x-2">
                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-md object-cover" />
                            <div>
                              <p className="font-bold text-slate-800">{user.name}</p>
                              <p className="text-[10px] text-slate-400">{user.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-600">{user.department}</td>
                        <td className="py-2.5 font-mono text-slate-700">{checkInTime}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {mode}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'leave' ? 'bg-amber-100 text-amber-800' :
                            status === 'half-day' ? 'bg-sky-100 text-sky-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Employee Profiles & Quick Management Hub */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Employee Profiles Hub</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {allUsers.length} Staff Members
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-3">
              Direct access to employee dossiers, compensation details, contact records, and portal simulation.
            </p>

            {/* Quick Profile Filter & Search */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Quick search employee profile..."
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Employee Profiles List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {allUsers
                .filter(u => 
                  u.name.toLowerCase().includes(profileSearch.toLowerCase()) || 
                  u.employeeId.toLowerCase().includes(profileSearch.toLowerCase()) ||
                  u.department.toLowerCase().includes(profileSearch.toLowerCase())
                )
                .map((user) => {
                  const gross = user.salaryStructure.baseSalary + user.salaryStructure.hra + user.salaryStructure.specialAllowance;
                  return (
                    <div
                      key={user.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="relative">
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                              <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1 rounded">
                                {user.employeeId}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate font-medium">
                              {user.designation} • <span className="text-slate-700 font-semibold">{user.department}</span>
                            </p>
                          </div>
                        </div>

                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Staff'}
                        </span>
                      </div>

                      {/* Info Chips */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg">
                        <span className="truncate">📍 {user.workLocation}</span>
                        <span className="font-mono font-bold text-slate-700">₹{gross.toLocaleString()}/mo</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => setDossierUser(user)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedEmployeeId(user.id);
                            setActiveTab('profile');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          Profile Page
                        </button>
                        
                        <button
                          onClick={() => switchUser(user.id)}
                          className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          title="Switch login session to this employee"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Login As</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('employees')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-indigo-600 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Open Full Workforce Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Employee Dossier Modal */}
      {dossierUser && (
        <EmployeeDossierModal
          user={dossierUser}
          onClose={() => setDossierUser(null)}
        />
      )}

    </div>
  );
};
