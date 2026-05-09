/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FitnessLevel, WorkoutRoutine, LogEntry } from '../types';
import { WORKOUT_ROUTINES } from '../constants';
import ExerciseCard from './ExerciseCard';
import RestTimer from './RestTimer';
import { Trophy, ArrowLeft, TrendingUp, Search, X } from 'lucide-react';

interface WorkoutListProps {
  level: FitnessLevel;
  onBack: () => void;
  onViewStats: () => void;
  logs: { [exerciseId: string]: LogEntry[] };
  isDarkMode: boolean;
  accentColor: string;
}

export default function WorkoutList({ level, onBack, onViewStats, logs, isDarkMode, accentColor }: WorkoutListProps) {
  const [day, setDay] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [restDuration, setRestDuration] = useState(() => {
    const saved = localStorage.getItem('gymlink-rest-duration');
    return saved ? parseInt(saved) : 60;
  });
  
  const routinesForLevel = WORKOUT_ROUTINES.filter(r => r.level === level);
  const routine = routinesForLevel.find(r => r.day === day) || routinesForLevel[0];
  const maxDays = Math.max(...routinesForLevel.map(r => r.day), 1);

  const filteredExercises = routine?.exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    const saved = localStorage.getItem(`completed-${level}-day-${day}`);
    if (saved) {
      setCompletedExercises(JSON.parse(saved));
    } else {
      setCompletedExercises([]);
    }
  }, [level, day]);

  const toggleExercise = (id: string, logData?: { reps: number; weight: number }[]) => {
    const isNowCompleted = !completedExercises.includes(id);
    const updated = isNowCompleted
      ? [...completedExercises, id]
      : completedExercises.filter(x => x !== id);
    
    setCompletedExercises(updated);
    localStorage.setItem(`completed-${level}-day-${day}`, JSON.stringify(updated));

    if (isNowCompleted) {
      // Save detailed logs
      const allLogsRaw = localStorage.getItem('gymlink-logs') || '{}';
      const allLogs = JSON.parse(allLogsRaw);
      const entry = {
        date: new Date().toISOString(),
        sets: logData || []
      };
      
      if (!allLogs[id]) allLogs[id] = [];
      allLogs[id].push(entry);
      localStorage.setItem('gymlink-logs', JSON.stringify(allLogs));

      if (updated.length < (routine?.exercises.length || 0)) {
        setShowRestTimer(true);
      }
    }
  };

  const isRoutineFinished = routine?.exercises.every(e => completedExercises.includes(e.id));

  const handleRestChange = (seconds: number) => {
    setRestDuration(seconds);
    localStorage.setItem('gymlink-rest-duration', seconds.toString());
  };

  return (
    <div className={`flex flex-col min-h-screen pb-32 transition-colors duration-300 ${isSearchOpen ? '' : ''}`}>
      <header className="sticky top-0 z-10 bg-black/20 dark:bg-black/20 backdrop-blur-md px-6 py-4 border-b border-white/10 dark:border-rose-900/40">
        <div className="flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <button 
                onClick={onBack} 
                className="p-2 -ml-2 text-inherit hover:opacity-70 transition-colors"
                id="workout-back-btn"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="text-center">
                <h1 className="font-bold text-lg dark:text-inherit">{routine?.name || 'No Workout'}</h1>
                <p className="text-xs text-inherit/60 uppercase tracking-widest">{level} • Day {day}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-inherit opacity-60 hover:opacity-100 transition-all"
                  id="open-search-btn"
                >
                  <Search size={20} />
                </button>
                <button 
                  onClick={onViewStats}
                  className="p-2 bg-white/10 dark:bg-rose-950/20 text-inherit opacity-60 hover:opacity-100 rounded-xl transition-all"
                  id="view-stats-btn"
                >
                  <TrendingUp size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 dark:border-rose-900/40 px-3 py-1 shadow-sm transition-all">
              <Search size={18} className="text-inherit opacity-40 mr-2" />
              <input
                autoFocus
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 py-1 text-sm focus:outline-none text-inherit placeholder:opacity-40"
              />
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-inherit opacity-40 hover:opacity-60"
                id="close-search-btn"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            {Array.from({ length: maxDays }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setDay(i + 1)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  day === i + 1 
                    ? 'scale-105 shadow-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                    : 'bg-white/40 backdrop-blur-sm text-inherit opacity-60 border border-white/20 dark:bg-black/40 dark:border-rose-900/20'
                }`}
              >
                Day {i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white/10 dark:bg-rose-950/20 rounded-full p-1 ml-4 shadow-sm border border-white/10 dark:border-rose-900/20">
            {[30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => handleRestChange(d)}
                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                  restDuration === d ? 'bg-accent text-black shadow-sm' : 'text-inherit opacity-40'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 py-4">
        <AnimatePresence>
          {showRestTimer && (
            <RestTimer duration={restDuration} onClose={() => setShowRestTimer(false)} />
          )}
        </AnimatePresence>
        {!routine ? (
           <div className="text-center py-20">
            <p className="text-inherit opacity-40">No workout scheduled for this day yet.</p>
           </div>
        ) : (
          <>
            {isRoutineFinished && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-100 border border-green-200 p-6 rounded-2xl mb-8 text-center"
              >
                <div className="inline-flex p-3 bg-green-500 text-white rounded-full mb-3">
                  <Trophy size={32} />
                </div>
                <h2 className="text-xl font-bold text-green-800">Workout Complete!</h2>
                <p className="text-green-700 text-sm">You crushed today's {level} session.</p>
              </motion.div>
            )}

            <div className="space-y-4">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {(() => {
                      const exerciseLogs = logs[exercise.id] || [];
                      const lastLog = exerciseLogs.length > 0 ? exerciseLogs[exerciseLogs.length - 1].sets : undefined;
                      return (
                        <ExerciseCard
                          exercise={exercise}
                          onComplete={toggleExercise}
                          isCompleted={completedExercises.includes(exercise.id)}
                          previousLog={lastLog}
                        />
                      );
                    })()}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-3xl border border-dashed border-white/10 dark:border-rose-900/40">
                  <Search size={40} className="mx-auto text-inherit opacity-20 mb-2" />
                  <p className="text-inherit opacity-40 text-sm">No exercises found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/20 dark:bg-black/40 backdrop-blur-md border-t border-white/10 dark:border-rose-900/40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="h-2 bg-white/10 dark:bg-rose-950/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent animate-pulse-slow"
                initial={{ width: 0 }}
                animate={{ width: `${routine ? (completedExercises.length / routine.exercises.length) * 100 : 0}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              />
            </div>
            <p className="text-[10px] text-inherit opacity-40 mt-1 font-bold uppercase tracking-tighter">
              Progress: {completedExercises.length}/{routine?.exercises.length || 0} Exercises
            </p>
          </div>
          <div className="text-right">
            <motion.span 
              key={completedExercises.length}
              initial={{ scale: 1.2, color: 'var(--accent)' }}
              animate={{ scale: 1, color: 'var(--app-text)' }}
              className="text-2xl font-bold block"
            >
              {routine ? Math.round((completedExercises.length / routine.exercises.length) * 100) : 0}%
            </motion.span>
          </div>
        </div>
      </footer>
    </div>
  );
}
