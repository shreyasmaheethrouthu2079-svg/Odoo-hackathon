import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AttendanceRecord, LeaveRequest, Payslip, NotificationAlert, Role, AttendanceStatus, LeaveType, LeaveStatus } from '../types';
import { INITIAL_USERS, INITIAL_ATTENDANCE_RECORDS, INITIAL_LEAVE_REQUESTS, INITIAL_PAYSLIPS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface HRMSContextType {
  currentUser: User | null;
  allUsers: User[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payslips: Payslip[];
  notifications: NotificationAlert[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (userData: { employeeId: string; name: string; email: string; role: Role; designation?: string; department?: string }) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  quickSwitchRole: (role: Role) => void;
  // Attendance
  todayAttendance: AttendanceRecord | undefined;
  checkIn: (workMode?: 'Office' | 'Remote' | 'Hybrid', locationNote?: string) => void;
  checkOut: () => void;
  adminUpdateAttendance: (recordId: string, status: AttendanceStatus, notes?: string) => void;
  adminAddAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  // Leave
  applyLeave: (data: { leaveType: LeaveType; startDate: string; endDate: string; daysCount: number; isHalfDay: boolean; remarks: string }) => { success: boolean; error?: string };
  adminReviewLeave: (requestId: string, status: 'approved' | 'rejected', comment?: string) => void;
  cancelLeave: (requestId: string) => void;
  // Employee Profile
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  addNewEmployee: (employeeData: Omit<User, 'id' | 'leaveBalance' | 'documents'>) => void;
  // Payroll
  updateSalaryStructure: (employeeId: string, structure: User['salaryStructure']) => void;
  generateMonthlyPayroll: (monthName: string) => void;
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  addNotification: (title: string, message: string, type: NotificationAlert['type'], linkTab?: string) => void;
  // Selected employee for admin detail inspection
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  // Sidebar Collapsible & Mobile State
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'dayflow_hrms_users_v2',
  CURRENT_USER_ID: 'dayflow_hrms_curr_user_id_v2',
  ATTENDANCE: 'dayflow_hrms_attendance_v2',
  LEAVES: 'dayflow_hrms_leaves_v2',
  PAYSLIPS: 'dayflow_hrms_payslips_v2',
  NOTIFICATIONS: 'dayflow_hrms_notifications_v2',
  ACTIVE_TAB: 'dayflow_hrms_tab_v2',
  SIDEBAR_COLLAPSED: 'dayflow_hrms_sidebar_collapsed_v2',
};

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State Initialization from LocalStorage or Initial Mocks
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved ? saved : null;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYSLIPS);
    return saved ? JSON.parse(saved) : INITIAL_PAYSLIPS;
  });

  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return saved || 'dashboard';
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return saved ? JSON.parse(saved) : false;
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(next));
      return next;
    });
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYSLIPS, JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  };

  const currentUser = allUsers.find(u => u.id === currentUserId) || null;

  // Add Notification Helper
  const addNotification = (title: string, message: string, type: NotificationAlert['type'], linkTab?: string) => {
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      linkTab,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth Methods
  const login = (email: string, _password?: string) => {
    const foundUser = allUsers.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (foundUser) {
      setCurrentUserId(foundUser.id);
      addNotification(
        'Welcome back to Dayflow',
        `Logged in successfully as ${foundUser.name} (${foundUser.role === 'admin' ? 'Admin / HR' : 'Employee'}).`,
        'system'
      );
      return { success: true };
    }
    return { success: false, error: 'No account found with this email. Please check your credentials or sign up.' };
  };

  const signup = (userData: { employeeId: string; name: string; email: string; role: Role; designation?: string; department?: string }) => {
    const exists = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase() || u.employeeId === userData.employeeId);
    if (exists) {
      return { success: false, error: 'An employee with this email or Employee ID already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      employeeId: userData.employeeId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      designation: userData.designation || (userData.role === 'admin' ? 'HR Operations Manager' : 'Software Engineer'),
      department: userData.department || (userData.role === 'admin' ? 'Human Resources' : 'Engineering'),
      phone: '+1 (555) 019-2834',
      address: '100 Silicon Ave, Tech District, CA 94025',
      dateOfJoining: new Date().toISOString().split('T')[0],
      workLocation: 'Hybrid',
      salaryStructure: {
        baseSalary: 7500,
        hra: 2500,
        specialAllowance: 1200,
        providentFund: 600,
        professionalTax: 200,
        incomeTax: 1100,
      },
      documents: [
        { id: `doc-${Date.now()}`, title: 'Standard Employment Onboarding Agreement', category: 'Contract', uploadDate: new Date().toISOString().split('T')[0], fileSize: '1.5 MB' }
      ],
      leaveBalance: {
        paid: { total: 20, used: 0 },
        sick: { total: 10, used: 0 },
        unpaid: { total: 10, used: 0 },
      },
    };

    setAllUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    addNotification('Account Created', `Welcome to Dayflow HRMS, ${newUser.name}! Your workspace is ready.`, 'system');
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      addNotification('User Switched', `Active user changed to ${user.name} (${user.role.toUpperCase()})`, 'system');
    }
  };

  const quickSwitchRole = (targetRole: Role) => {
    const candidate = allUsers.find(u => u.role === targetRole);
    if (candidate) {
      setCurrentUserId(candidate.id);
      addNotification('Role Switched', `Now acting as ${candidate.name} (${targetRole === 'admin' ? 'Admin / HR' : 'Employee'})`, 'system');
    }
  };

  // Today's attendance calculation
  const todayDateStr = '2026-08-22'; // Fixed current mock date
  const todayAttendance = currentUser ? attendanceRecords.find(r => r.employeeId === currentUser.employeeId && r.date === todayDateStr) : undefined;

  // Attendance Punch-in
  const checkIn = (workMode: 'Office' | 'Remote' | 'Hybrid' = 'Hybrid', locationNote?: string) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    if (todayAttendance) {
      // update existing
      setAttendanceRecords(prev => prev.map(r => {
        if (r.id === todayAttendance.id) {
          return {
            ...r,
            checkInTime: r.checkInTime || timeStr,
            status: 'present',
            workMode,
            locationNote: locationNote || r.locationNote,
          };
        }
        return r;
      }));
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        department: currentUser.department,
        date: todayDateStr,
        checkInTime: timeStr,
        status: 'present',
        workMode,
        locationNote: locationNote || (workMode === 'Remote' ? 'Home Office (VPN)' : 'San Francisco HQ'),
      };
      setAttendanceRecords(prev => [newRecord, ...prev]);
    }

    addNotification(
      'Clocked In Successfully',
      `Checked in at ${timeStr} as ${workMode}. Have a wonderful shift!`,
      'attendance',
      'attendance'
    );
  };

  // Attendance Punch-out
  const checkOut = () => {
    if (!currentUser || !todayAttendance) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Calculate total hours
    let hoursWorked = 8.2;
    if (todayAttendance.checkInTime) {
      const [inH, inM] = todayAttendance.checkInTime.split(':').map(Number);
      const curH = now.getHours();
      const curM = now.getMinutes();
      const diffMinutes = (curH * 60 + curM) - (inH * 60 + inM);
      if (diffMinutes > 0) {
        hoursWorked = Math.round((diffMinutes / 60) * 100) / 100;
      }
    }

    setAttendanceRecords(prev => prev.map(r => {
      if (r.id === todayAttendance.id) {
        return {
          ...r,
          checkOutTime: timeStr,
          totalHours: hoursWorked,
        };
      }
      return r;
    }));

    addNotification(
      'Clocked Out Successfully',
      `Checked out at ${timeStr}. Total shift recorded: ${hoursWorked} hrs.`,
      'attendance',
      'attendance'
    );
  };

  const adminUpdateAttendance = (recordId: string, status: AttendanceStatus, notes?: string) => {
    setAttendanceRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status,
          notes: notes !== undefined ? notes : r.notes,
        };
      }
      return r;
    }));
    addNotification('Attendance Updated', `Attendance record ${recordId} updated to ${status}.`, 'attendance');
  };

  const adminAddAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-manual-${Date.now()}`,
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
    addNotification('Attendance Log Added', `Manual attendance entry added for ${record.employeeName}.`, 'attendance');
  };

  // Leave Management
  const applyLeave = (data: { leaveType: LeaveType; startDate: string; endDate: string; daysCount: number; isHalfDay: boolean; remarks: string }) => {
    if (!currentUser) return { success: false, error: 'User must be signed in.' };

    const balance = currentUser.leaveBalance[data.leaveType === 'casual' ? 'paid' : data.leaveType];
    if (balance && (balance.total - balance.used) < data.daysCount) {
      return { success: false, error: `Insufficient leave balance. You have ${balance.total - balance.used} day(s) remaining for ${data.leaveType} leave.` };
    }

    const newRequest: LeaveRequest = {
      id: `leave-req-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: data.daysCount,
      isHalfDay: data.isHalfDay,
      remarks: data.remarks,
      status: 'pending',
      appliedDate: todayDateStr,
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    addNotification(
      'Leave Request Submitted',
      `Your request for ${data.daysCount} day(s) of ${data.leaveType} leave has been submitted for HR approval.`,
      'leave',
      'leaves'
    );
    return { success: true };
  };

  const adminReviewLeave = (requestId: string, status: 'approved' | 'rejected', comment?: string) => {
    let affectedLeave: LeaveRequest | undefined;
    
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        affectedLeave = req;
        return {
          ...req,
          status,
          reviewedBy: currentUser?.name || 'HR Admin',
          reviewedDate: todayDateStr,
          adminComment: comment || (status === 'approved' ? 'Request approved by HR.' : 'Request rejected.'),
        };
      }
      return req;
    }));

    if (affectedLeave && status === 'approved') {
      // Deduct from employee balance
      const empId = affectedLeave.employeeId;
      const leaveTypeKey = affectedLeave.leaveType === 'casual' ? 'paid' : affectedLeave.leaveType;
      const count = affectedLeave.daysCount;

      setAllUsers(prev => prev.map(u => {
        if (u.employeeId === empId) {
          const currentBal = u.leaveBalance[leaveTypeKey];
          return {
            ...u,
            leaveBalance: {
              ...u.leaveBalance,
              [leaveTypeKey]: {
                ...currentBal,
                used: currentBal.used + count,
              }
            }
          };
        }
        return u;
      }));

      // Also create an attendance note if it falls today
      if (affectedLeave.startDate <= todayDateStr && affectedLeave.endDate >= todayDateStr) {
        setAttendanceRecords(prev => {
          const existing = prev.find(r => r.employeeId === empId && r.date === todayDateStr);
          if (existing) {
            return prev.map(r => r.id === existing.id ? { ...r, status: 'leave', notes: `On Approved ${affectedLeave?.leaveType} Leave` } : r);
          }
          return [
            {
              id: `att-leave-${Date.now()}`,
              employeeId: empId,
              employeeName: affectedLeave!.employeeName,
              department: affectedLeave!.department,
              date: todayDateStr,
              status: 'leave',
              workMode: 'Remote',
              notes: `On Approved ${affectedLeave!.leaveType} Leave`,
            },
            ...prev
          ];
        });
      }
    }

    addNotification(
      `Leave Request ${status.toUpperCase()}`,
      `Leave request ${requestId} has been ${status}${comment ? `: "${comment}"` : ''}.`,
      'leave'
    );
  };

  const cancelLeave = (requestId: string) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== requestId));
    addNotification('Leave Request Cancelled', 'Your pending leave request has been cancelled.', 'leave');
  };

  // User profile updates
  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          ...updates,
          salaryStructure: updates.salaryStructure ? { ...u.salaryStructure, ...updates.salaryStructure } : u.salaryStructure,
          emergencyContact: updates.emergencyContact ? { ...u.emergencyContact, ...updates.emergencyContact } : u.emergencyContact,
        };
      }
      return u;
    }));
    addNotification('Profile Updated', 'Employee details have been saved successfully.', 'system');
  };

  const addNewEmployee = (employeeData: Omit<User, 'id' | 'leaveBalance' | 'documents'>) => {
    const newUser: User = {
      ...employeeData,
      id: `usr-emp-${Date.now()}`,
      avatar: employeeData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80`,
      documents: [
        { id: `doc-${Date.now()}`, title: 'Standard Employment Agreement', category: 'Contract', uploadDate: todayDateStr, fileSize: '1.8 MB' },
        { id: `doc-${Date.now()}-2`, title: 'Identity Documentation', category: 'ID Proof', uploadDate: todayDateStr, fileSize: '1.2 MB' },
      ],
      leaveBalance: {
        paid: { total: 20, used: 0 },
        sick: { total: 10, used: 0 },
        unpaid: { total: 10, used: 0 },
      },
    };

    setAllUsers(prev => [...prev, newUser]);
    addNotification('New Employee Onboarded', `${newUser.name} (${newUser.employeeId}) has been added to ${newUser.department}.`, 'system', 'employees');
  };

  // Payroll structure update
  const updateSalaryStructure = (employeeId: string, structure: User['salaryStructure']) => {
    setAllUsers(prev => prev.map(u => {
      if (u.employeeId === employeeId) {
        return {
          ...u,
          salaryStructure: structure,
        };
      }
      return u;
    }));
    addNotification('Salary Structure Updated', `Compensation package for employee ${employeeId} updated.`, 'payroll');
  };

  // Generate Monthly Payroll
  const generateMonthlyPayroll = (monthName: string) => {
    const newSlips: Payslip[] = allUsers.map(user => {
      const gross = user.salaryStructure.baseSalary + user.salaryStructure.hra + user.salaryStructure.specialAllowance;
      const deductions = user.salaryStructure.providentFund + user.salaryStructure.professionalTax + user.salaryStructure.incomeTax;
      const net = gross - deductions;

      return {
        id: `ps-${Date.now()}-${user.employeeId}`,
        month: monthName,
        employeeId: user.employeeId,
        employeeName: user.name,
        designation: user.designation,
        department: user.department,
        payDate: todayDateStr,
        baseSalary: user.salaryStructure.baseSalary,
        hra: user.salaryStructure.hra,
        specialAllowance: user.salaryStructure.specialAllowance,
        bonus: 0,
        grossSalary: gross,
        providentFund: user.salaryStructure.providentFund,
        professionalTax: user.salaryStructure.professionalTax,
        incomeTax: user.salaryStructure.incomeTax,
        totalDeductions: deductions,
        netSalary: net,
        status: 'paid',
      };
    });

    setPayslips(prev => [...newSlips, ...prev]);
    addNotification('Payroll Run Complete', `Payroll successfully processed for ${allUsers.length} employees for ${monthName}.`, 'payroll', 'payroll');
  };

  // Notifications helper
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <HRMSContext.Provider
      value={{
        currentUser,
        allUsers,
        attendanceRecords,
        leaveRequests,
        payslips,
        notifications,
        activeTab,
        setActiveTab,
        login,
        signup,
        logout,
        switchUser,
        quickSwitchRole,
        todayAttendance,
        checkIn,
        checkOut,
        adminUpdateAttendance,
        adminAddAttendanceRecord,
        applyLeave,
        adminReviewLeave,
        cancelLeave,
        updateUserProfile,
        addNewEmployee,
        updateSalaryStructure,
        generateMonthlyPayroll,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        addNotification,
        selectedEmployeeId,
        setSelectedEmployeeId,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within a HRMSProvider');
  }
  return context;
};
