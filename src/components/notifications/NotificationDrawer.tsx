import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  CalendarOff, 
  Clock, 
  Banknote, 
  Sparkles, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setActiveTab 
  } = useHRMS();

  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave': return <CalendarOff className="w-4 h-4 text-amber-600" />;
      case 'attendance': return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'payroll': return <Banknote className="w-4 h-4 text-purple-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Notifications & Alerts</h3>
                <p className="text-[11px] text-slate-500">Live workflow events & announcements</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex border-b border-slate-100 p-2 space-x-1 bg-white overflow-x-auto text-xs">
            {(['all', 'leave', 'attendance', 'payroll', 'system'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg capitalize font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterType === type 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {filteredNotifs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold">You're all caught up!</p>
                <p className="text-[11px] text-slate-400">No unread alerts matching this filter.</p>
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer m-1 flex items-start space-x-3 ${
                    !notif.read 
                      ? 'bg-indigo-50/60 border border-indigo-200/80 shadow-2xs' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    
                    {notif.linkTab && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-indigo-600 hover:underline">
                        Open in {notif.linkTab} →
                      </span>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer simulation */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
            Email & in-app alerts are synchronized with Dayflow HRMS.
          </div>
        </motion.div>
      </div>
    </div>
  );
};
