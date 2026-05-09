import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, Check, Bell, Calendar } from 'lucide-react';
import { Announcement } from '../types';
import { ADMIN_ANNOUNCEMENTS } from '../constants';

interface AnnouncementsProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export default function Announcements({ onClose, isDarkMode }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('gymlink-read-announcements');
    const readIds = saved ? JSON.parse(saved) : [];
    return ADMIN_ANNOUNCEMENTS.map(ann => ({
      ...ann,
      isRead: readIds.includes(ann.id)
    }));
  });

  const markAsRead = (id: string) => {
    const updated = announcements.map(ann => 
      ann.id === id ? { ...ann, isRead: true } : ann
    );
    setAnnouncements(updated);
    
    const readIds = updated.filter(ann => ann.isRead).map(ann => ann.id);
    localStorage.setItem('gymlink-read-announcements', JSON.stringify(readIds));
  };

  const unreadCount = announcements.filter(ann => !ann.isRead).length;

  return (
    <div className="flex flex-col h-full bg-inherit pt-safe">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/20 rounded-xl">
            <Megaphone size={24} className="text-accent" />
          </div>
          <div>
            <h2 className={`text-xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              ANNOUNCEMENTS
            </h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              From GymLink HQ
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {unreadCount > 0 && (
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-3 flex items-center space-x-3">
            <Bell size={16} className="text-accent animate-bounce" />
            <span className="text-xs font-bold text-accent uppercase">
              You have {unreadCount} unread update{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {[...announcements].reverse().map((ann, i) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-5 rounded-3xl transition-all border ${
                ann.isRead 
                  ? 'bg-transparent border-white/5 opacity-60' 
                  : 'bg-white/5 border-accent/30 shadow-lg shadow-accent/5'
              }`}
            >
              {!ann.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
              
              <div className="flex items-center space-x-2 mb-2 opacity-40">
                <Calendar size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {new Date(ann.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h3 className={`text-lg font-bold leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {ann.title}
              </h3>
              
              <p className="text-sm opacity-70 leading-relaxed mb-4">
                {ann.content}
              </p>

              {!ann.isRead && (
                <button
                  onClick={() => markAsRead(ann.id)}
                  className="flex items-center space-x-2 text-[10px] font-black italic text-accent hover:opacity-80 transition-opacity uppercase tracking-widest"
                >
                  <Check size={12} />
                  <span>Mark as read</span>
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Megaphone size={48} strokeWidth={1} />
            <p className="mt-4 font-bold uppercase tracking-widest text-xs">No announcements yet</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10">
        <p className="text-[10px] text-center opacity-40 font-medium">
          Only official admin announcements are displayed here.
        </p>
      </div>
    </div>
  );
}
