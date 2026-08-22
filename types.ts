export type Role = 'employee' | 'admin';

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';

export type LeaveType = 'paid' | 'sick' | 'unpaid' | 'casual';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  designation: string;
  department: string;
  phone: string;
  address: string;
  dateOfJoining: string;
  workLocation: 'Office' | 'Remote' | 'Hybrid';
  managerName?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  salaryStructure: {
    baseSalary: number;
    hra: number; // House Rent Allowance
    specialAllowance: number;
    providentFund: number;
    professionalTax: number;
    incomeTax: number;
  };
  documents: {
    id: string;
    title: string;
    category: 'Contract' | 'ID Proof' | 'Certificate' | 'Tax Form';
    uploadDate: string;
    fileSize: string;
  }[];
  leaveBalance: {
    paid: { total: number; used: number };
    sick: { total: number; used: number };
    unpaid: { total: number; used: number };
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm:ss
  checkOutTime?: string; // HH:mm:ss
  totalHours?: number;
  status: AttendanceStatus;
  workMode: 'Office' | 'Remote' | 'Hybrid';
  locationNote?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  isHalfDay: boolean;
  remarks: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  adminComment?: string;
}

export interface Payslip {
  id: string;
  month: string; // "October 2026"
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  payDate: string;
  baseSalary: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  grossSalary: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netSalary: number;
  status: 'paid' | 'processing' | 'held';
}

export interface NotificationAlert {
  id: string;
  userId?: string; // Target specific user, or global if undefined
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'payroll' | 'announcement' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}