import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Payslip, User } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { 
  Banknote, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  Edit3, 
  Play, 
  ShieldCheck, 
  TrendingUp, 
  X, 
  DollarSign,
  Printer,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const PayrollView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    payslips, 
    updateSalaryStructure, 
    generateMonthlyPayroll 
  } = useHRMS();

  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [editSalaryUser, setEditSalaryUser] = useState<User | null>(null);
  const [salaryForm, setSalaryForm] = useState({
    baseSalary: 0,
    hra: 0,
    specialAllowance: 0,
    providentFund: 0,
    professionalTax: 200,
    incomeTax: 0,
  });

  const [payrollMonth, setPayrollMonth] = useState('August 2026');
  const [payrollRunSuccess, setPayrollRunSuccess] = useState(false);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Base payslips depending on role
  const displayedPayslips = isAdmin 
    ? payslips 
    : payslips.filter(p => p.employeeId === currentUser.employeeId);

  // Total organization payroll summary
  const totalOrgGross = allUsers.reduce((sum, u) => sum + (u.salaryStructure.baseSalary + u.salaryStructure.hra + u.salaryStructure.specialAllowance), 0);
  const totalOrgDeductions = allUsers.reduce((sum, u) => sum + (u.salaryStructure.providentFund + u.salaryStructure.professionalTax + u.salaryStructure.incomeTax), 0);
  const totalOrgNet = totalOrgGross - totalOrgDeductions;

  const handleOpenSalaryEdit = (user: User) => {
    setEditSalaryUser(user);
    setSalaryForm({
      baseSalary: user.salaryStructure.baseSalary,
      hra: user.salaryStructure.hra,
      specialAllowance: user.salaryStructure.specialAllowance,
      providentFund: user.salaryStructure.providentFund,
      professionalTax: user.salaryStructure.professionalTax,
      incomeTax: user.salaryStructure.incomeTax,
    });
  };

  const handleSaveSalaryStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSalaryUser) return;
    updateSalaryStructure(editSalaryUser.employeeId, salaryForm);
    setEditSalaryUser(null);
  };

  const handleRunBatchPayroll = () => {
    generateMonthlyPayroll(payrollMonth);
    setPayrollRunSuccess(true);
    setTimeout(() => setPayrollRunSuccess(false), 4000);
  };

  return (
    <div id="payroll-view" className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Payroll & Salary Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              {isAdmin ? 'Admin Payroll Suite' : 'Employee Salary Portal'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin 
              ? 'Configure employee compensation packages, manage deduction schedules, and disburse monthly payroll.' 
              : 'Read-only visibility into your salary structure, tax withholdings, and verifiable digital payslips.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <select
              value={payrollMonth}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs outline-hidden focus:ring-2 focus:ring-purple-500 bg-white font-medium text-slate-700"
            >
              <option value="August 2026">August 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="October 2026">October 2026</option>
            </select>
            <button
              onClick={handleRunBatchPayroll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Batch Payroll</span>
            </button>
          </div>
        )}
      </div>

      {/* Payroll Batch Success Alert */}
      {payrollRunSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between"
        >
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">Payroll Cycle Disbursed for {payrollMonth}!</p>
              <p className="text-emerald-700 text-[11px]">Direct deposits scheduled and payslips auto-generated for {allUsers.length} employees.</p>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-900 text-sm">₹{totalOrgNet.toLocaleString()} Payout</span>
        </motion.div>
      )}

      {/* Overview Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAdmin ? 'Total Gross Payroll' : 'My Gross Earnings'}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">
              ₹{(isAdmin ? totalOrgGross : (currentUser.salaryStructure.baseSalary + currentUser.salaryStructure.hra + currentUser.salaryStructure.specialAllowance)).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Before statutory deductions & taxes</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAdmin ? 'Statutory Deductions' : 'Total Withholdings & PF'}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-rose-600">
              ₹{(isAdmin ? totalOrgDeductions : (currentUser.salaryStructure.providentFund + currentUser.salaryStructure.professionalTax + currentUser.salaryStructure.incomeTax)).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Includes PF (8%), TDS, and State Tax</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAdmin ? 'Net Organization Payout' : 'My Net Take-Home Salary'}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">
              ₹{(isAdmin ? totalOrgNet : (currentUser.salaryStructure.baseSalary + currentUser.salaryStructure.hra + currentUser.salaryStructure.specialAllowance - (currentUser.salaryStructure.providentFund + currentUser.salaryStructure.professionalTax + currentUser.salaryStructure.incomeTax))).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Disbursed on the final workday of every month</p>
        </div>

      </div>

      {/* Admin: Employee Salary Structure Matrix (Section 3.6.2 Admin Payroll Control) */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Employee Compensation Structure Control</h3>
              <p className="text-xs text-slate-500">Configure base salary, allowances, and withholdings for all staff</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click "Edit Structure" to adjust pay components</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Base Salary</th>
                  <th className="px-5 py-3">HRA</th>
                  <th className="px-5 py-3">Allowance</th>
                  <th className="px-5 py-3">Gross</th>
                  <th className="px-5 py-3">Deductions (PF/Tax)</th>
                  <th className="px-5 py-3">Net Take-Home</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map((user) => {
                  const gross = user.salaryStructure.baseSalary + user.salaryStructure.hra + user.salaryStructure.specialAllowance;
                  const deductions = user.salaryStructure.providentFund + user.salaryStructure.professionalTax + user.salaryStructure.incomeTax;
                  const net = gross - deductions;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-2.5">
                          <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.employeeId} • {user.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-700">₹{user.salaryStructure.baseSalary.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono text-slate-700">₹{user.salaryStructure.hra.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono text-slate-700">₹{user.salaryStructure.specialAllowance.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono font-bold text-slate-900">₹{gross.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono text-rose-600">-₹{deductions.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono font-bold text-emerald-600">₹{net.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleOpenSalaryEdit(user)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ml-auto cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslips Archive & Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Generated Monthly Payslips Archive</h3>
            <p className="text-xs text-slate-500">Official itemized salary slips with instant view & printable PDF format</p>
          </div>
          <span className="text-xs text-slate-500">{displayedPayslips.length} slips on record</span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayedPayslips.map((slip) => (
            <div key={slip.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-bold text-slate-900">{slip.month} Payslip</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      {slip.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {slip.employeeName} ({slip.employeeId}) • Pay Date: {slip.payDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Disbursed</span>
                  <p className="text-sm font-bold text-emerald-600 font-mono">₹{slip.netSalary.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedPayslip(slip)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Slip</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPayslip(slip);
                      setTimeout(() => window.print(), 200);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Salary Structure Modal (Admin Only) */}
      {editSalaryUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Update Salary Structure</h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  {editSalaryUser.name} ({editSalaryUser.employeeId}) • {editSalaryUser.designation}
                </p>
              </div>
              <button
                onClick={() => setEditSalaryUser(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSalaryStructure} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={salaryForm.baseSalary}
                    onChange={(e) => setSalaryForm({ ...salaryForm, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">HRA Allowance (₹)</label>
                  <input
                    type="number"
                    required
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Special / Performance Allowance (₹)</label>
                  <input
                    type="number"
                    required
                    value={salaryForm.specialAllowance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, specialAllowance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Provident Fund (PF) (₹)</label>
                  <input
                    type="number"
                    required
                    value={salaryForm.providentFund}
                    onChange={(e) => setSalaryForm({ ...salaryForm, providentFund: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Tax (₹)</label>
                  <input
                    type="number"
                    required
                    value={salaryForm.professionalTax}
                    onChange={(e) => setSalaryForm({ ...salaryForm, professionalTax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Income Tax / TDS (₹)</label>
                  <input
                    type="number"
                    required
                    value={salaryForm.incomeTax}
                    onChange={(e) => setSalaryForm({ ...salaryForm, incomeTax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Net preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Calculated Net Pay:</span>
                <span className="text-emerald-600 text-sm">
                  ₹{(salaryForm.baseSalary + salaryForm.hra + salaryForm.specialAllowance - (salaryForm.providentFund + salaryForm.professionalTax + salaryForm.incomeTax)).toLocaleString()} / mo
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditSalaryUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Save Salary Structure
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Itemized Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden print:p-0 print:border-none print:shadow-none"
          >
            {/* Modal Header Actions */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold">Dayflow Payslip #{selectedPayslip.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Payslip Document Body */}
            <div className="p-8 space-y-6">
              
              {/* Slip Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center space-x-3">
                  <BrandLogo className="w-11 h-11 shadow-sm" rounded="rounded-xl" />
                  <div>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider text-slate-900">DAYFLOW HRMS INC.</h2>
                    <p className="text-xs text-slate-500">Every workday, perfectly aligned.</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Statement</span>
                  <p className="text-base font-bold text-indigo-600">{selectedPayslip.month}</p>
                  <p className="text-[10px] text-slate-400">Payment Date: {selectedPayslip.payDate}</p>
                </div>
              </div>

              {/* Employee Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Employee Name</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedPayslip.employeeName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Employee ID</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedPayslip.employeeId}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Department</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedPayslip.department}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Designation</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedPayslip.designation}</p>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Earnings Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-900 uppercase tracking-wider border-b border-emerald-100 flex items-center justify-between">
                    <span>Earnings</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs p-2 space-y-1">
                    <div className="flex justify-between py-1 px-2">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-mono font-semibold text-slate-900">₹{selectedPayslip.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 px-2">
                      <span className="text-slate-600">House Rent Allowance</span>
                      <span className="font-mono font-semibold text-slate-900">₹{selectedPayslip.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 px-2">
                      <span className="text-slate-600">Special Allowance</span>
                      <span className="font-mono font-semibold text-slate-900">₹{selectedPayslip.specialAllowance.toLocaleString()}</span>
                    </div>
                    {selectedPayslip.bonus > 0 && (
                      <div className="flex justify-between py-1 px-2 text-emerald-700 font-semibold">
                        <span>Performance Bonus</span>
                        <span className="font-mono">₹{selectedPayslip.bonus.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1.5 px-2 font-bold bg-slate-50 border-t border-slate-200">
                      <span>Gross Earnings</span>
                      <span className="font-mono text-slate-900">₹{selectedPayslip.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-rose-50 px-4 py-2 text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-rose-100 flex items-center justify-between">
                    <span>Deductions</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs p-2 space-y-1">
                    <div className="flex justify-between py-1 px-2">
                      <span className="text-slate-600">Provident Fund (PF)</span>
                      <span className="font-mono font-semibold text-slate-900">₹{selectedPayslip.providentFund.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 px-2">
                      <span className="text-slate-600">Professional State Tax</span>
                      <span className="font-mono font-semibold text-slate-900">₹{selectedPayslip.professionalTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 px-2">
                      <span className="text-slate-600">Income Tax (TDS)</span>
                      <span className="font-mono font-semibold text-slate-900">₹{selectedPayslip.incomeTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2 font-bold bg-slate-50 border-t border-slate-200 text-rose-700">
                      <span>Total Deductions</span>
                      <span className="font-mono">₹{selectedPayslip.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Net Payout Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                    Net Take-Home Pay
                  </span>
                  <p className="text-2xl font-mono font-bold">₹{selectedPayslip.netSalary.toLocaleString()}</p>
                </div>
                <div className="text-right text-[11px] text-emerald-100">
                  <p>Disbursed via Direct Bank Deposit</p>
                  <p className="font-semibold text-white">Status: Confirmed & Paid</p>
                </div>
              </div>

              {/* Security & Verification Stamp */}
              <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-4 flex items-center justify-between">
                <span>Dayflow HRMS Payroll Engine • Generated Electronically</span>
                <span>Authorized HR Sign-off: Sarada Prasad Dash</span>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
