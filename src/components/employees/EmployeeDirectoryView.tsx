import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Role, User } from '../../types';
import { EmployeeDossierModal } from './EmployeeDossierModal';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight, 
  ArrowRightLeft, 
  X, 
  Building, 
  Sparkles,
  Eye,
  Calendar,
  DollarSign,
  Briefcase,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeeDirectoryView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    addNewEmployee, 
    switchUser, 
    setSelectedEmployeeId, 
    setActiveTab,
    attendanceRecords 
  } = useHRMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');
  const [dossierUser, setDossierUser] = useState<User | null>(null);
  
  // Add Employee Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpId, setNewEmpId] = useState(`DF-${Math.floor(1100 + Math.random() * 8900)}`);
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<Role>('employee');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');
  const [newEmpDesignation, setNewEmpDesignation] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('+1 (555) 000-1122');
  const [newEmpAddress, setNewEmpAddress] = useState('450 Tech Plaza, San Francisco, CA');
  const [newEmpLocation, setNewEmpLocation] = useState<'Office' | 'Remote' | 'Hybrid'>('Hybrid');
  const [newEmpSalary, setNewEmpSalary] = useState(8000);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Metrics for HR
  const totalEmployees = allUsers.length;
  const remoteCount = allUsers.filter(u => u.workLocation === 'Remote').length;
  const hybridCount = allUsers.filter(u => u.workLocation === 'Hybrid').length;
  const officeCount = allUsers.filter(u => u.workLocation === 'Office').length;
  const departmentsList = Array.from(new Set(allUsers.map(u => u.department)));

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || user.department === departmentFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addNewEmployee({
      employeeId: newEmpId,
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newEmpName)}`,
      designation: newEmpDesignation || 'Product Specialist',
      department: newEmpDept,
      phone: newEmpPhone,
      address: newEmpAddress,
      dateOfJoining: '2026-08-22',
      workLocation: newEmpLocation,
      managerName: 'Sarada Prasad Dash (HR)',
      emergencyContact: {
        name: 'Primary Contact',
        relationship: 'Family',
        phone: newEmpPhone,
      },
      salaryStructure: {
        baseSalary: Number(newEmpSalary),
        hra: Math.round(Number(newEmpSalary) * 0.35),
        specialAllowance: Math.round(Number(newEmpSalary) * 0.15),
        providentFund: Math.round(Number(newEmpSalary) * 0.08),
        professionalTax: 200,
        incomeTax: Math.round(Number(newEmpSalary) * 0.12),
      },
    });

    setAddModalOpen(false);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpDesignation('');
  };

  return (
    <div id="employees-directory" className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Workforce & Employee Profiles</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {allUsers.length} Active Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive HR overview of employee profiles, compensation tiers, contact dossiers, and permissions.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewLayout === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewLayout === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* HR Workforce Distribution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Headcount</span>
            <span className="text-lg font-bold text-slate-900">{totalEmployees} Members</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Departments</span>
            <span className="text-lg font-bold text-slate-900">{departmentsList.length} Units</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Work Modes</span>
            <span className="text-xs font-bold text-slate-800">
              {officeCount} Onsite • {hybridCount} Hyb • {remoteCount} Rem
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Admin Tier</span>
            <span className="text-lg font-bold text-slate-900">{allUsers.filter(u => u.role === 'admin').length} Admins</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, ID, title, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
          >
            <option value="All">All Roles</option>
            <option value="admin">HR Admin</option>
            <option value="employee">Staff Employee</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> employee profiles
        </div>
      </div>

      {/* Instagram-Style Profile Grid View */}
      {viewLayout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredUsers.map((user) => {
            return (
              <motion.div
                key={user.id}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedEmployeeId(user.id);
                  setActiveTab('profile');
                }}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col items-center justify-between text-center relative group cursor-pointer"
              >
                {/* Admin Quick Action Pill */}
                {isAdmin && (
                  <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDossierUser(user);
                      }}
                      className="p-1.5 rounded-full bg-white shadow-xs border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Quick Dossier"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        switchUser(user.id);
                      }}
                      className="p-1.5 rounded-full bg-white shadow-xs border border-slate-200 text-purple-600 hover:bg-purple-50 transition-colors"
                      title="Login As"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Top Badge: Role / Mode */}
                <div className="w-full flex items-center justify-between text-[10px] mb-2 px-0.5">
                  <span className="font-mono text-slate-400 font-semibold">{user.employeeId}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role === 'admin' ? 'HR Admin' : user.workLocation}
                  </span>
                </div>

                {/* Instagram Story Gradient Ring & Avatar */}
                <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                  <div className="p-[3px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-xs">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-white bg-white block"
                    />
                  </div>
                  <span
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"
                    title="Active"
                  />
                </div>

                {/* Name & Job Title (Requested: Name & Job) */}
                <div className="w-full px-1">
                  <div className="flex items-center justify-center space-x-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </h3>
                    {user.role === 'admin' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100 shrink-0" />
                    )}
                  </div>

                  {/* Job Title / Designation */}
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {user.designation}
                  </p>

                  {/* Department Tag */}
                  <div className="mt-1.5 flex justify-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50/70 text-indigo-700 border border-indigo-100/80 truncate max-w-full">
                      {user.department}
                    </span>
                  </div>
                </div>

                {/* Instagram-Style "View Profile" Action Button */}
                <div className="mt-4 w-full pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployeeId(user.id);
                      setActiveTab('profile');
                    }}
                    className="w-full py-1.5 bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="px-5 py-3">Employee Profile</th>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Designation</th>
                  <th className="px-5 py-3">Reporting To</th>
                  <th className="px-5 py-3">Mode</th>
                  {isAdmin && <th className="px-5 py-3">Monthly Gross</th>}
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const gross = user.salaryStructure.baseSalary + user.salaryStructure.hra + user.salaryStructure.specialAllowance;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-2.5">
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-slate-700">{user.employeeId}</td>
                      <td className="px-5 py-3 text-slate-600 font-medium">{user.department}</td>
                      <td className="px-5 py-3 text-slate-800 font-medium">{user.designation}</td>
                      <td className="px-5 py-3 text-slate-600">{user.managerName || 'Sarada Prasad Dash'}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {user.workLocation}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3 font-mono font-bold text-indigo-700">
                          ₹{gross.toLocaleString()}
                        </td>
                      )}
                      <td className="px-5 py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setDossierUser(user)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Dossier
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployeeId(user.id);
                            setActiveTab('profile');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => switchUser(user.id)}
                            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Login
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Dossier Modal */}
      {dossierUser && (
        <EmployeeDossierModal
          user={dossierUser}
          onClose={() => setDossierUser(null)}
        />
      )}

      {/* Add New Employee Modal (Admin Only) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Onboard New Employee</h3>
                <p className="text-xs text-purple-200 mt-0.5">Register a new team member into the Dayflow HRMS repository</p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    placeholder="Marcus Sterling"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="marcus.sterling@dayflow.io"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmpDesignation}
                    onChange={(e) => setNewEmpDesignation(e.target.value)}
                    placeholder="e.g. Senior Backend Architect"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role Allocation</label>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value as Role)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="employee">Standard Employee</option>
                    <option value="admin">HR / Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location</label>
                  <select
                    value={newEmpLocation}
                    onChange={(e) => setNewEmpLocation(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Office">Office (San Francisco HQ)</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={newEmpSalary}
                  onChange={(e) => setNewEmpSalary(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Create Employee Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
