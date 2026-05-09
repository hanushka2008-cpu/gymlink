/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { FitnessLevel, User } from '../types';
import { Dumbbell, Shield, Trophy, Flame } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: FitnessLevel | null;
  onSelect: (level: FitnessLevel) => void;
  user?: User | null;
}

export default function LevelSelector({ currentLevel, onSelect, user }: LevelSelectorProps) {
  const levels: { id: FitnessLevel; label: string; description: string; icon: any }[] = [
    {
      id: 'beginner',
      label: 'Beginner',
      description: 'New to the gym or returning after a long break.',
      icon: Shield
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      description: 'Familiar with movements and training for 6+ months.',
      icon: Dumbbell
    },
    {
      id: 'advanced',
      label: 'Advanced',
      description: 'Experienced lifter looking for serious intensity.',
      icon: Trophy
    }
  ];

  return (
    <div className="flex flex-col space-y-6 p-6 transition-colors duration-300">
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/10 border border-accent/20 rounded-[2rem] p-4 flex items-center justify-between shadow-xl shadow-accent/5 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-black">
              <Flame size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Current Streak</p>
              <h3 className="text-xl font-black italic tracking-tighter text-accent">
                {user.currentStreak} DAY{user.currentStreak !== 1 ? 'S' : ''}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Personal Best</p>
            <p className="text-sm font-bold opacity-80">{user.longestStreak} Days</p>
          </div>
        </motion.div>
      )}

      <div className="text-center space-y-2 pt-2">
        <h2 className="font-bold text-slate-900 dark:text-inherit leading-tight">Ready to Level Up?</h2>
        <p className="text-inherit opacity-40 text-sm">Select your experience to get started with today's routine.</p>
      </div>

      <div className="grid gap-4">
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = currentLevel === level.id;

          return (
            <motion.button
              key={level.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(level.id)}
              className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-accent bg-accent/20 dark:bg-accent/10 backdrop-blur-md ring-2 ring-accent/20'
                  : 'border-white/40 dark:border-rose-900/10 bg-white/40 dark:bg-black/40 backdrop-blur-sm hover:border-slate-200 dark:hover:border-rose-900/40 shadow-sm border-slate-100/40'
              }`}
              id={`level-button-${level.id}`}
            >
              <div className={`p-3 rounded-xl mr-4 ${isSelected ? 'bg-accent text-black' : 'bg-slate-50 dark:bg-rose-950/20 text-slate-600 dark:text-rose-600'}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-inherit">{level.label}</h3>
                <p className="text-xs text-inherit opacity-60 leading-normal">{level.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">GymLink Solo v1.0</p>
      </div>
    </div>
  );
}
