/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FitnessLevel, LogEntry, SubscriptionStatus, User } from './types';
import LevelSelector from './components/LevelSelector';
import WorkoutList from './components/WorkoutList';
import StatsDashboard from './components/StatsDashboard';
import ThemeSettings from './components/ThemeSettings';
import Paywall from './components/Paywall';
import Announcements from './components/Announcements';
import Login from './components/Login';
import Chatbot from './components/Chatbot';
import DietTracker from './components/DietTracker';
import { Dumbbell, BarChart3, Settings, Zap, Trophy, Activity, Flame, Heart, Timer, Crown, Megaphone, LogOut, User as UserIcon, Bot, MessageCircle, Apple } from 'lucide-react';
import { ADMIN_ANNOUNCEMENTS } from './constants';

const CINEMATIC_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Mountains
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', // Forest
  'https://images.unsplash.com/photo-1439405326854-0151a241c4d2?auto=format&fit=crop&w=1200&q=80', // Ocean
  'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=80', // Desert
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80', // Wilderness
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Lakes
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80', // Woods
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80'  // Countryside
];

export default function App() {
  const [level, setLevel] = useState<FitnessLevel | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showDiet, setShowDiet] = useState(false);
  const [logs, setLogs] = useState<{ [exerciseId: string]: LogEntry[] }>({});
  const [hasUnreadAnnouncements, setHasUnreadAnnouncements] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gymlink-dark-mode');
    return saved === null ? true : saved === 'true'; // Default to dark
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('gymlink-accent-color') || 'red'; // Default to red
  });
  const [textColor, setTextColor] = useState(() => {
    return localStorage.getItem('gymlink-text-color') || 'red'; // Default to red
  });

  const [user, setUser] = useState<User | null>(null);

  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    trialStartDate: null,
    isSubscribed: false,
    daysRemaining: 7,
    isExpired: false
  });

  useEffect(() => {
    const trialStart = localStorage.getItem('gymlink-trial-start');
    const isSubscribed = localStorage.getItem('gymlink-subscribed') === 'true';
    const savedUser = localStorage.getItem('gymlink-user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        const lastActive = parsedUser.lastActiveDate ? new Date(parsedUser.lastActiveDate) : null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let updatedUser = { ...parsedUser };
        let hasChanges = false;

        if (lastActive) {
          const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
          const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day! (But wait for workout log to increment for real attendance? 
            // Or just app opening? User requested "Attendance streaks". 
            // Let's do app opening for now, or better: just check periodically.)
            // For now, let's just make sure we track it.
          } else if (diffDays > 1) {
            // Streak broken
            updatedUser.currentStreak = 0;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          localStorage.setItem('gymlink-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } else {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    let startDate = trialStart;
    if (!trialStart) {
      startDate = new Date().toISOString();
      localStorage.setItem('gymlink-trial-start', startDate);
    }

    const start = new Date(startDate!);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const daysRemaining = Math.max(0, 7 - diffDays);
    const isExpired = daysRemaining <= 0 && !isSubscribed;

    setSubscription({
      trialStartDate: startDate,
      isSubscribed,
      daysRemaining,
      isExpired
    });
  }, []);

  const handleSubscribe = () => {
    localStorage.setItem('gymlink-subscribed', 'true');
    setSubscription(prev => ({ ...prev, isSubscribed: true, isExpired: false }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('gymlink-dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('gymlink-accent-color', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('gymlink-text-color', textColor);
  }, [textColor]);

  useEffect(() => {
    const savedLevel = localStorage.getItem('gymlink-user-level') as FitnessLevel;
    if (savedLevel) {
      setLevel(savedLevel);
    }
    
    const savedLogs = localStorage.getItem('gymlink-logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    setIsInitializing(false);
    
    // Check for unread announcements
    const savedRead = localStorage.getItem('gymlink-read-announcements');
    const readIds = savedRead ? JSON.parse(savedRead) : [];
    const unread = ADMIN_ANNOUNCEMENTS.some(ann => !readIds.includes(ann.id));
    setHasUnreadAnnouncements(unread);
  }, []);

  const handleLevelSelect = (newLevel: FitnessLevel) => {
    setLevel(newLevel);
    localStorage.setItem('gymlink-user-level', newLevel);
  };

  const handleBack = () => {
    setLevel(null);
    localStorage.removeItem('gymlink-user-level');
  };

  const handleViewStats = () => {
    // Refresh logs before showing stats
    const savedLogs = localStorage.getItem('gymlink-logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    setShowStats(true);
  };

  const handleOpenAnnouncements = () => {
    setShowAnnouncements(true);
    setHasUnreadAnnouncements(false); // Optimistically clear dot
  };

  const handleLogin = (newUser: User) => {
    localStorage.setItem('gymlink-user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('gymlink-user');
    setUser(null);
    setShowSettings(false);
  };

  const handleActivity = () => {
    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const lastActiveDay = lastActive ? new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()) : null;

    if (!lastActiveDay || today.getTime() > lastActiveDay.getTime()) {
      const diffDays = lastActiveDay ? Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      let newStreak = user.currentStreak;
      if (diffDays === 1 || !lastActiveDay) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const updatedUser: User = {
        ...user,
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        lastActiveDate: now.toISOString()
      };

      setUser(updatedUser);
      localStorage.setItem('gymlink-user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    if (user && !isInitializing) {
      handleActivity();
    }
  }, [user, isInitializing]);

  if (isInitializing) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-blue-500"
        >
          <Dumbbell size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto min-h-screen ${isDarkMode ? 'bg-black' : 'bg-slate-50 text-slate-900'} shadow-xl relative overflow-x-hidden theme-${accentColor} text-theme-${textColor} text-[color:var(--app-text)] ${isDarkMode ? 'dark' : ''} pt-safe pb-safe`} id="app-root">
      {/* Trial Banner */}
      {!subscription.isSubscribed && (
        <div className={`relative z-50 px-4 py-1.5 text-[10px] font-bold text-center uppercase tracking-[0.2em] flex items-center justify-center space-x-2 ${subscription.isExpired ? 'bg-red-500 text-white' : 'bg-accent text-black'}`}>
          <Crown size={12} fill="currentColor" />
          <span>{subscription.isExpired ? 'TRIAL EXPIRED - SUBSCRIBE TO ACCESS' : `${subscription.daysRemaining} DAYS LEFT IN FREE TRIAL`}</span>
        </div>
      )}
      {/* Cinematic Background - Rotates every 24 hours */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: isDarkMode ? 0.5 : 0.65 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${CINEMATIC_BACKGROUNDS[new Date().getDate() % CINEMATIC_BACKGROUNDS.length]})`,
          }}
        />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/30' : 'bg-white/5'} backdrop-blur-none`} />
        
        {/* Workout Doodles Layer */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => {
            const icons = [Dumbbell, Zap, Trophy, Activity, Flame, Heart, Timer];
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={`doodle-${i}`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 5 + (i % 4), 
                  repeat: Infinity, 
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
                className="absolute text-current"
                style={{
                  top: `${(i * 12 + 5) % 95}%`,
                  left: `${(i * 18 + 7) % 95}%`,
                  transform: `rotate(${(i * 60) % 360}deg)`,
                }}
              >
                <Icon size={24 + (i % 3) * 12} strokeWidth={1} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-12"
            >
              <Login 
                onLogin={handleLogin} 
                isDarkMode={isDarkMode} 
                accentColor={accentColor} 
              />
            </motion.div>
          ) : subscription.isExpired ? (
            <motion.div
              key="paywall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-12"
            >
              <Paywall 
                onSubscribe={handleSubscribe} 
                isDarkMode={isDarkMode} 
                accentColor={accentColor} 
              />
            </motion.div>
          ) : showAnnouncements ? (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full min-h-screen"
            >
              <Announcements 
                onClose={() => setShowAnnouncements(false)} 
                isDarkMode={isDarkMode} 
              />
            </motion.div>
          ) : showChatbot ? (
            <motion.div
              key="chatbot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full min-h-screen"
            >
              <Chatbot 
                onClose={() => setShowChatbot(false)} 
                isDarkMode={isDarkMode} 
              />
            </motion.div>
          ) : showDiet ? (
            <motion.div
              key="diet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full min-h-screen"
            >
              <DietTracker 
                onClose={() => setShowDiet(false)} 
                isDarkMode={isDarkMode} 
              />
            </motion.div>
          ) : showStats ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <StatsDashboard onBack={() => setShowStats(false)} logs={logs} user={user} />
          </motion.div>
        ) : !level ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pt-8"
          >
            <div className="px-6 mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-accent p-2 rounded-lg text-black">
                  <Dumbbell size={24} />
                </div>
                <h1 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? '' : 'text-slate-900'}`}>GYMLINK</h1>
              </div>
            <div className="flex items-center space-x-2">
                {user && (
                    <div className="flex items-center space-x-2 mr-2">
                        <div className="flex flex-col items-end mr-1">
                          <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none mb-0.5`}>
                            {user.name.split(' ')[0]}
                          </p>
                          {user.role === 'admin' && (
                            <span className="text-[7px] font-black bg-accent text-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className={`w-8 h-8 rounded-full overflow-hidden border-2 ${user.role === 'admin' ? 'border-accent' : 'border-accent/20'}`}>
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
                <button 
                  onClick={() => setShowDiet(true)}
                  className="p-2 text-slate-400 hover:text-accent transition-colors"
                  title="Diet Tracker"
                >
                  <Apple size={22} />
                </button>
                <button 
                  onClick={handleOpenAnnouncements}
                  className="p-2 text-slate-400 hover:text-accent transition-colors relative"
                  title="Announcements"
                >
                  <Megaphone size={22} />
                  {hasUnreadAnnouncements && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-black animate-pulse" />
                  )}
                </button>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 transition-colors ${showSettings ? 'text-accent' : 'text-slate-400'}`}
                  title="Theme Settings"
                >
                  <Settings size={22} />
                </button>
                <button 
                  onClick={handleViewStats}
                  className="p-2 text-slate-400 hover:text-accent transition-colors"
                  title="View Progress"
                >
                  <BarChart3 size={24} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <ThemeSettings 
                  isDarkMode={isDarkMode} 
                  setIsDarkMode={setIsDarkMode} 
                  accentColor={accentColor} 
                  setAccentColor={setAccentColor}
                  textColor={textColor}
                  setTextColor={setTextColor}
                />
              )}
            </AnimatePresence>

            <LevelSelector currentLevel={level} onSelect={handleLevelSelect} user={user} />
          </motion.div>
        ) : (
          <motion.div
            key="workouts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <WorkoutList 
              level={level} 
              onBack={handleBack} 
              onViewStats={handleViewStats}
              logs={logs}
              isDarkMode={isDarkMode}
              accentColor={accentColor}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Floating AI Chatbot Button */}
      {user && !subscription.isExpired && !showChatbot && !showAnnouncements && !showStats && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-black rounded-2xl shadow-2xl shadow-accent/40 flex items-center justify-center z-50 group"
          title="Ask AI Coach"
        >
          <Bot size={28} className="group-hover:hidden" />
          <MessageCircle size={28} className="hidden group-hover:block" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
        </motion.button>
      )}
    </div>
  );
}
