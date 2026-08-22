import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { LeaveType, LeaveStatus } from '../../types';
import { 
  CalendarOff, 
  Send, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  FileText, 
  Filter, 
  Search,
  MessageSquare,
  Sparkles,
  Info,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

export const LeaveView: React.FC = () => {
  const { 
    currentUser, 
    leaveRequests, 
    applyLeave, 
    adminReviewLeave, 
    cancelLeave 
  } = useHRMS();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>('paid');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-02');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filter & Search state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin review action state
  const [adminCommentModal, setAdminCommentModal] = useState<{ id: string; action: 'approved' | 'rejected'; name: string } | null>(null);
  const [adminCommentText, setAdminCommentText] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Calculate days between start and end
  const calcDays = () => {
    if (isHalfDay) return 0.5;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const days = calcDays();
    const res = applyLeave({
      leaveType: selectedLeaveType,
      startDate,
      endDate: isHalfDay ? startDate : endDate,
      daysCount: days,
      isHalfDay,
      remarks,
    });

    if (res.success) {
      setApplyModalOpen(false);
      setRemarks('');
    } else {
      setFormError(res.error || 'Failed to submit leave request.');
    }
  };

  const handleConfirmAdminAction = () => {
    if (!adminCommentModal) return;
    adminReviewLeave(adminCommentModal.id, adminCommentModal.action, adminCommentText);
    setAdminCommentModal(null);
    setAdminCommentText('');
  };

  // Filter displayed requests
  const baseRequests = isAdmin 
    ? leaveRequests 
    : leaveRequests.filter(r => r.employeeId === currentUser.employeeId);

  const filteredRequests = baseRequests.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch = r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div id="leaves-view" className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Leave & Time-Off Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              {isAdmin ? 'Admin Approval Queue' : 'My Leave Portal'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin 
              ? 'Review pending time-off requests, provide feedback notes, and approve or reject submissions.' 
              : 'Submit leave applications, track remaining balances across categories, and view approval feedback.'}
          </p>
        </div>

        <button
          onClick={() => setApplyModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Apply for Time-Off</span>
        </button>
      </div>

      {/* Leave Balances Cards (Shows for employee, and admin's own balances) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Paid Leave Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Paid / Annual Leave</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Accrued
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">
              {currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {currentUser.leaveBalance.paid.total} days total
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {currentUser.leaveBalance.paid.used} days utilized this calendar year
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used) / currentUser.leaveBalance.paid.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Sick Leave Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sick / Medical Leave</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Medical
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">
              {currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {currentUser.leaveBalance.sick.total} days total
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {currentUser.leaveBalance.sick.used} days utilized for recovery
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used) / currentUser.leaveBalance.sick.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Unpaid Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Unpaid / Emergency</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
              Flexible
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">
              {currentUser.leaveBalance.unpaid.total - currentUser.leaveBalance.unpaid.used}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {currentUser.leaveBalance.unpaid.total} quota
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Subject to manager & operational approval
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-slate-700 h-2 rounded-full transition-all"
              style={{ width: `${((currentUser.leaveBalance.unpaid.total - currentUser.leaveBalance.unpaid.used) / currentUser.leaveBalance.unpaid.total) * 100}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Leave Requests Table & Filter Hub */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search requests or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
              {(['All', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredRequests.length}</span> request submissions
          </div>
        </div>

        {/* Requests List */}
        <div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <CalendarOff className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No leave requests found.</p>
              <p className="text-[11px] text-slate-400">Try adjusting your search criteria or apply for new time-off.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Employee & Type info */}
                  <div className="flex items-start space-x-3.5">
                    <img src={req.employeeAvatar} alt={req.employeeName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-slate-900">{req.employeeName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">({req.employeeId})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                          {req.department}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {req.leaveType} Leave
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          📅 {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          {req.daysCount} {req.daysCount === 1 ? 'Day' : 'Days'} {req.isHalfDay ? '(Half-Day)' : ''}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 max-w-2xl">
                        "{req.remarks}"
                      </p>

                      {/* Admin Review Note (if reviewed) */}
                      {req.reviewedBy && (
                        <div className="mt-2 text-[11px] text-slate-600 flex items-center space-x-2">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                          <span>
                            Reviewed by <span className="font-semibold text-slate-800">{req.reviewedBy}</span> on {req.reviewedDate}: 
                            <span className="font-medium text-slate-700 italic ml-1">"{req.adminComment}"</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Action Buttons */}
                  <div className="flex flex-row md:flex-col items-end justify-between gap-3 shrink-0">
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center space-x-1.5 ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      req.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                    }`}>
                      {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'rejected' && <X className="w-3.5 h-3.5" />}
                      {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      <span>{req.status}</span>
                    </span>

                    {/* Admin Actions */}
                    {isAdmin && req.status === 'pending' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <button
                          onClick={() => setAdminCommentModal({ id: req.id, action: 'approved', name: req.employeeName })}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setAdminCommentModal({ id: req.id, action: 'rejected', name: req.employeeName })}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {/* Employee Cancel Action */}
                    {!isAdmin && req.status === 'pending' && (
                      <button
                        onClick={() => cancelLeave(req.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Apply Leave Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Apply for Leave / Time-Off</h3>
                <p className="text-xs text-amber-100 mt-0.5">Submit your time-off request for HR approval</p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{formError}</p>
                </div>
              )}

              {/* Leave Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Leave Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['paid', 'sick', 'unpaid'] as LeaveType[]).map((type) => {
                    const balance = currentUser.leaveBalance[type];
                    const remaining = balance ? balance.total - balance.used : 0;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedLeaveType(type)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedLeaveType === type
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-xs font-bold capitalize">{type} Leave</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{remaining} days balance</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates & Half-Day Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    disabled={isHalfDay}
                    value={isHalfDay ? startDate : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="half-day-check"
                  checked={isHalfDay}
                  onChange={(e) => setIsHalfDay(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="half-day-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Half-day leave (0.5 day only)
                </label>
              </div>

              {/* Total Days Calculated */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Estimated Duration:</span>
                <span className="font-bold text-amber-800 text-sm">
                  {calcDays()} {calcDays() === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Provide brief context for HR and manager approval..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Action Feedback Modal */}
      {adminCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6"
          >
            <h3 className="text-base font-bold text-slate-900">
              {adminCommentModal.action === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              For employee: <span className="font-semibold text-slate-800">{adminCommentModal.name}</span>
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Comment / Feedback (Will be visible to employee)
              </label>
              <textarea
                rows={3}
                value={adminCommentText}
                onChange={(e) => setAdminCommentText(e.target.value)}
                placeholder={adminCommentModal.action === 'approved' ? 'e.g. Approved. Please ensure handoff note is posted.' : 'e.g. Please reschedule due to sprint launch window.'}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAdminCommentModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdminAction}
                className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-all cursor-pointer ${
                  adminCommentModal.action === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {adminCommentModal.action === 'approved' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
