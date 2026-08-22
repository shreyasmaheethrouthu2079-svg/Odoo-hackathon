import React, { useState } from 'react';
import { HRMSProvider, useHRMS } from './context/HRMSContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { SignUpStartingView } from './components/auth/SignUpStartingView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AttendanceView } from './components/attendance/AttendanceView';
import { LeaveView } from './components/leaves/LeaveView';
import { EmployeeDirectoryView } from './components/employees/EmployeeDirectoryView';
import { ProfileView } from './components/profile/ProfileView';
import { PayrollView } from './components/payroll/PayrollView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { BottomQuickNav } from './components/BottomQuickNav';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { currentUser, activeTab } = useHRMS();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  // If user is not logged in, show dedicated animated Sign Up & Role Starting Page
  if (!currentUser) {
    return <SignUpStartingView onSignInSuccess={() => setAuthModalOpen(false)} />;
  }

  // Active App Layout when logged in
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
      case 'attendance':
        return <AttendanceView />;
      case 'leaves':
        return <LeaveView />;
      case 'employees':
        return <EmployeeDirectoryView />;
      case 'profile':
        return <ProfileView />;
      case 'payroll':
        return <PayrollView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return currentUser.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => { setAuthInitialMode('signin'); setAuthModalOpen(true); }}
        onOpenNotifications={() => setNotifDrawerOpen(true)}
      />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        
        {/* Dynamic View Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Slide-over Sidebar Drawer */}
      <Sidebar />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-4 pb-24 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold uppercase tracking-wider text-slate-800">DAYFLOW HRMS</span>
            <span>•</span>
            <span>Every workday, perfectly aligned.</span>
          </div>
          <p className="text-[11px]">Role-Based Access • Attendance Engine • Approval Workflows • Payroll Visibility</p>
        </div>
      </footer>

      {/* Floating Bottom Quick Navigation Bar */}
      <BottomQuickNav />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <HRMSProvider>
      <MainContent />
    </HRMSProvider>
  );
}
