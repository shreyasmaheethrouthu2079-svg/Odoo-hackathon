import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { User } from '../../types';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Banknote, 
  Clock, 
  CalendarDays, 
  UserCheck, 
  Edit3, 
  ArrowRightLeft, 
  Download, 
  ExternalLink,
  Briefcase,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeeDossierModalProps {
  user: User | null;
  onClose: () => void;
  onEditProfile?: (user: User) => void;
}

export const EmployeeDossierModal: React.FC<EmployeeDossierModalProps> = ({
  user,
  onClose,
  onEditProfile,
}) => {
  const { 
    currentUser, 
    switchUser, 
    setSelectedEmployeeId, 
    setActiveTab, 
    attendanceRecords, 
    leaveRequests,
    payslips 
  } = useHRMS();

  const [activeTab, setActiveTabLocal] = useState<'overview' | 'job' | 'salary' | 'activity'>('overview');

  if (!user) return null;

  const isAdmin = currentUser?.role === 'admin';

  // Attendance stats for this employee
  const userAttendance = attendanceRecords.filter(r => r.employeeId === user.employeeId);
  const presentDays = userAttendance.filter(r => r.status === 'present' || r.status === 'half-day').length;
  const leaveDays = userAttendance.filter(r => r.status === 'leave').length;

  // Leave records for this employee
  const userLeaves = leaveRequests.filter(r => r.employeeId === user.employeeId);

  // Payslips for this employee
  const userPayslips = payslips.filter(p => p.employeeId === user.employeeId);

  // Salary calculations
  const gross = user.salaryStructure.baseSalary + user.salaryStructure.hra + user.salaryStructure.specialAllowance;
  const deductions = user.salaryStructure.providentFund + user.salaryStructure.professionalTax + user.salaryStructure.incomeTax;
  const netMonthly = gross - deductions;
  const annualCtc = gross * 12;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-600 relative p-6 flex items-start justify-between">
            <div className="flex items-center space-x-2 text-white/90 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-200" />
              <span>Dayflow HRMS • Verified Employee Dossier</span>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Overview Card */}
          <div className="px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
              <div className="flex items-end space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
                />
                <div className="mb-0.5">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {user.role === 'admin' ? 'HR Admin' : 'Staff Employee'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{user.designation} • <span className="font-semibold text-slate-700">{user.department}</span></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedEmployeeId(user.id);
                    setActiveTab('profile');
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Profile Page</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      switchUser(user.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                    title="Switch login session to this employee"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Login As</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 border-b border-slate-200 mb-5 text-xs font-semibold">
              {[
                { id: 'overview', label: 'Personal & Contact' },
                { id: 'job', label: 'Job & Organizational' },
                { id: 'salary', label: 'Salary Structure' },
                { id: 'activity', label: 'Attendance & Leaves' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabLocal(tab.id as any)}
                  className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal & Contact */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Corporate Email</span>
                    <div className="flex items-center space-x-2 text-slate-800 font-semibold truncate">
                      <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Phone Contact</span>
                    <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 font-medium text-[11px] block">Residential Address</span>
                    <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{user.address}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {user.emergencyContact && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-amber-900 text-xs">Designated Emergency Contact</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-slate-700 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Contact Person</span>
                        <span className="font-semibold">{user.emergencyContact.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Relationship</span>
                        <span className="font-semibold">{user.emergencyContact.relationship}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Emergency Phone</span>
                        <span className="font-semibold text-indigo-700">{user.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Job & Organizational */}
            {activeTab === 'job' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Employee ID</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">{user.employeeId}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Department</span>
                    <span className="font-bold text-slate-800">{user.department}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Work Mode</span>
                    <span className="font-semibold text-emerald-700">📍 {user.workLocation}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Date of Joining</span>
                    <span className="font-semibold text-slate-800">{user.dateOfJoining}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Reporting Manager</span>
                    <span className="font-semibold text-slate-800">{user.managerName || 'Sarada Prasad Dash (HR)'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px] block">Employment Type</span>
                    <span className="font-bold text-indigo-900">Permanent Full-Time</span>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs text-indigo-900 font-medium">Access Tier: <strong className="font-bold">{user.role === 'admin' ? 'Executive HR Administrator' : 'Standard Employee Access'}</strong></span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Odoo HRMS Compliant
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: Salary Structure */}
            {activeTab === 'salary' && (
              <div className="space-y-4 text-xs">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Net Monthly Pay</span>
                    <span className="text-lg font-bold text-emerald-700">₹{netMonthly.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Gross Monthly</span>
                    <span className="text-lg font-bold text-indigo-700">₹{gross.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Annual CTC</span>
                    <span className="text-lg font-bold text-purple-700">₹{annualCtc.toLocaleString()}</span>
                  </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Earnings */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block border-b border-slate-200 pb-1 text-emerald-700">
                      Earnings & Allowances
                    </span>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Base Salary</span>
                      <span className="font-semibold text-slate-800">₹{user.salaryStructure.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">House Rent Allowance (HRA)</span>
                      <span className="font-semibold text-slate-800">₹{user.salaryStructure.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Special Allowance</span>
                      <span className="font-semibold text-slate-800">₹{user.salaryStructure.specialAllowance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block border-b border-slate-200 pb-1 text-rose-700">
                      Standard Deductions
                    </span>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Provident Fund (PF)</span>
                      <span className="font-semibold text-rose-600">-₹{user.salaryStructure.providentFund.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Professional Tax</span>
                      <span className="font-semibold text-rose-600">-₹{user.salaryStructure.professionalTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Income Tax (TDS)</span>
                      <span className="font-semibold text-rose-600">-₹{user.salaryStructure.incomeTax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center italic">
                  Compensation records are encrypted and managed in compliance with statutory standards.
                </p>
              </div>
            )}

            {/* Tab 4: Attendance & Leaves */}
            {activeTab === 'activity' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Present This Month</span>
                    <span className="text-xl font-bold text-emerald-700">{presentDays} Days</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Approved Leaves</span>
                    <span className="text-xl font-bold text-amber-700">{leaveDays} Days</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Generated Payslips</span>
                    <span className="text-xl font-bold text-indigo-700">{userPayslips.length} Slips</span>
                  </div>
                </div>

                {/* Recent Leave Requests */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Leave Request History</h4>
                  {userLeaves.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                      No leave requests filed recently.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userLeaves.slice(0, 3).map((l) => (
                        <div key={l.id} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800 capitalize">{l.leaveType} Leave</span>
                            <p className="text-[10px] text-slate-500">{l.startDate} to {l.endDate} ({l.daysCount} days)</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            l.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            l.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {l.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">ID: {user.employeeId}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
