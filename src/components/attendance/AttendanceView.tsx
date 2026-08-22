import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { AttendanceStatus } from '../../types';
import { 
  CalendarClock, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Filter, 
  Search, 
  Download, 
  Laptop, 
  Building2, 
  Home, 
  Plus, 
  Edit3, 
  UserCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

export const AttendanceView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    attendanceRecords, 
    todayAttendance, 
    checkIn, 
    checkOut, 
    adminUpdateAttendance,
    adminAddAttendanceRecord
  } = useHRMS();

  const [selectedDate, setSelectedDate] = useState('2026-08-22');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [workModeChoice, setWorkModeChoice] = useState<'Office' | 'Remote' | 'Hybrid'>('Remote');
  const [locationNote, setLocationNote] = useState('');

  // Admin Manual Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{ id?: string; employeeId: string; employeeName: string; department: string; status: AttendanceStatus; notes: string; date: string } | null>(null);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const isCheckedIn = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;

  // Filter records based on role (Section 3.4.2: Employees can view ONLY their own attendance; Admin can view all)
  const baseRecords = isAdmin 
    ? attendanceRecords 
    : attendanceRecords.filter(r => r.employeeId === currentUser.employeeId);

  const filteredRecords = baseRecords.filter(r => {
    const matchesDept = departmentFilter === 'All' || r.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch = r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  // Calculate Weekly Hours for employee view
  const weeklyDays = [
    { day: 'Mon', date: '2026-08-17', hours: 8.7, status: 'present' },
    { day: 'Tue', date: '2026-08-18', hours: 4.1, status: 'half-day' },
    { day: 'Wed', date: '2026-08-19', hours: 8.8, status: 'present' },
    { day: 'Thu', date: '2026-08-20', hours: 8.5, status: 'present' },
    { day: 'Fri', date: '2026-08-21', hours: 8.6, status: 'present' },
    { day: 'Sat', date: '2026-08-22', hours: isCheckedIn ? 4.5 : (todayAttendance?.totalHours || 0), status: todayAttendance ? todayAttendance.status : 'pending' },
    { day: 'Sun', date: '2026-08-23', hours: 0, status: 'weekend' },
  ];

  const totalWeeklyHours = weeklyDays.reduce((sum, d) => sum + d.hours, 0);

  const handleOpenEdit = (record: any) => {
    setEditingRecord({
      id: record.id,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      department: record.department,
      status: record.status,
      notes: record.notes || '',
      date: record.date,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    if (editingRecord.id) {
      adminUpdateAttendance(editingRecord.id, editingRecord.status, editingRecord.notes);
    } else {
      adminAddAttendanceRecord({
        employeeId: editingRecord.employeeId,
        employeeName: editingRecord.employeeName,
        department: editingRecord.department,
        date: editingRecord.date,
        status: editingRecord.status,
        workMode: 'Hybrid',
        notes: editingRecord.notes,
        checkInTime: '09:00:00',
        checkOutTime: '17:30:00',
        totalHours: 8.5,
      });
    }
    setEditModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Date,Employee ID,Name,Department,Check-In,Check-Out,Total Hours,Status,Work Mode,Notes"]
        .concat(filteredRecords.map(r => `"${r.date}","${r.employeeId}","${r.employeeName}","${r.department}","${r.checkInTime || ''}","${r.checkOutTime || ''}","${r.totalHours || ''}","${r.status}","${r.workMode}","${r.notes || ''}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Dayflow_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="attendance-view" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Attendance & Time Tracking</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {isAdmin ? 'Organization-Wide View' : 'Personal Attendance View'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin 
              ? 'Real-time visibility into all employee punch records, manual status overrides, and weekly metrics.' 
              : 'Log your daily check-in / check-out, monitor total hours worked, and track shift history.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <button
              onClick={() => {
                setEditingRecord({
                  employeeId: allUsers[0].employeeId,
                  employeeName: allUsers[0].name,
                  department: allUsers[0].department,
                  status: 'present',
                  notes: 'Manual entry',
                  date: selectedDate,
                });
                setEditModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Entry</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Employee Interactive Check-in & Weekly Breakdown Card (Always active for employee, or preview for Admin) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Punch In / Out Action Widget */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-indigo-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Today: {selectedDate}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isCheckedIn ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/15 text-slate-300'
            }`}>
              {isCheckedIn ? 'SHIFT ACTIVE' : todayAttendance?.checkOutTime ? 'SHIFT ENDED' : 'NOT STARTED'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-center">
              <p className="text-[11px] text-indigo-200 font-medium">Logged Check-In Time</p>
              <p className="text-2xl font-mono font-bold text-white mt-1">
                {todayAttendance?.checkInTime || '--:--:--'}
              </p>
              {todayAttendance?.checkOutTime && (
                <p className="text-[11px] text-emerald-300 mt-1">
                  Checked out at {todayAttendance.checkOutTime} ({todayAttendance.totalHours} hrs)
                </p>
              )}
            </div>

            {/* Check in / Check out CTAs */}
            {isCheckedIn ? (
              <button
                onClick={checkOut}
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Clock Out for Today</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-lg">
                  {(['Office', 'Remote', 'Hybrid'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWorkModeChoice(mode)}
                      className={`py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        workModeChoice === mode ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-indigo-300 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Location note (e.g., HQ Floor 3 or Home)..."
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 outline-hidden focus:border-indigo-400"
                  />
                </div>

                <button
                  onClick={() => checkIn(workModeChoice, locationNote)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Clock In as {currentUser.name.split(' ')[0]}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Weekly View & Visualizer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Attendance & Hours Track</h3>
                <p className="text-xs text-slate-500">August 17 – August 23, 2026</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Total Week Hours: </span>
                <span className="text-sm font-bold text-indigo-600">{Math.round(totalWeeklyHours * 10) / 10} / 40.0 hrs</span>
              </div>
            </div>

            {/* Weekly Bar Chart / Day Pills */}
            <div className="grid grid-cols-7 gap-2 mt-4">
              {weeklyDays.map((d) => (
                <div key={d.day} className="flex flex-col items-center">
                  <div className="text-[11px] font-bold text-slate-500 mb-1">{d.day}</div>
                  <div className="w-full bg-slate-100 rounded-xl h-24 p-1 flex flex-col justify-end relative group">
                    <div
                      className={`w-full rounded-lg transition-all ${
                        d.status === 'present' ? 'bg-emerald-500' :
                        d.status === 'half-day' ? 'bg-sky-400' :
                        d.status === 'leave' ? 'bg-amber-400' :
                        d.status === 'weekend' ? 'bg-slate-200' : 'bg-indigo-300'
                      }`}
                      style={{ height: `${Math.min(100, (d.hours / 9) * 100)}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/80 text-white rounded-xl text-[10px] font-mono transition-opacity">
                      {d.hours}h
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 mt-1.5">{d.hours}h</span>
                  <span className={`text-[9px] font-bold uppercase px-1 rounded mt-0.5 ${
                    d.status === 'present' ? 'text-emerald-700 bg-emerald-50' :
                    d.status === 'half-day' ? 'text-sky-700 bg-sky-50' :
                    d.status === 'weekend' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 mt-4">
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Half-day</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Leave</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Off</span>
            </div>
            <span className="font-semibold text-emerald-600">On Track for 100% Target</span>
          </div>
        </div>

      </div>

      {/* Attendance Logs Table with Filtering */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search employee or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            {isAdmin && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product Design">Product Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="present">Present</option>
              <option value="half-day">Half-Day</option>
              <option value="leave">Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredRecords.length}</span> recorded logs
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Punch In</th>
                <th className="px-5 py-3">Punch Out</th>
                <th className="px-5 py-3">Total Hours</th>
                <th className="px-5 py-3">Work Mode</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Notes & Location</th>
                {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="px-5 py-8 text-center text-slate-400">
                    No attendance records match your filter parameters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-bold text-slate-900">{record.employeeName}</p>
                        <p className="text-[10px] text-slate-400">{record.department} • {record.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {record.checkInTime || '--:--'}
                    </td>
                    <td className="px-5 py-3 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {record.checkOutTime || (record.checkInTime ? 'In Progress' : '--:--')}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {record.totalHours ? `${record.totalHours} hrs` : (record.checkInTime ? 'Active' : '-')}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {record.workMode}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        record.status === 'half-day' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        record.status === 'leave' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 max-w-xs truncate text-[11px]">
                      {record.locationNote || record.notes || '—'}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(record)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit / Override Attendance"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Admin Manual Edit / Override Modal */}
      {editModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {editingRecord.id ? 'Modify Attendance Record' : 'Record Manual Attendance Entry'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              HR override for employee <span className="font-semibold text-slate-700">{editingRecord.employeeName}</span> ({editingRecord.employeeId})
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editingRecord.date}
                  onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Allocation</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['present', 'half-day', 'leave', 'absent'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditingRecord({ ...editingRecord, status: st })}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        editingRecord.status === st 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HR Notes & Justification</label>
                <textarea
                  rows={3}
                  value={editingRecord.notes}
                  onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                  placeholder="e.g., Client onsite visit approval, biometric sync correction..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
