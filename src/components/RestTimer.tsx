/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, X, Play, Pause, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  duration: number; // in seconds
  onClose: () => void;
}

export default function RestTimer({ duration, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      // Maybe play a sound or vibrate if possible, but for now just stay at 0
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 left-4 right-4 z-50"
    >
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Timer size={20} />
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">Rest Timer</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="377"
                animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                transition={{ duration: 0.5 }}
                className="text-blue-500"
              />
            </svg>
            <span className="absolute text-3xl font-black tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTimeLeft(duration)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-4 rounded-full transition-all ${
                isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button
              onClick={() => setTimeLeft(Math.max(0, timeLeft - 15))}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              -15s
            </button>
            <button
              onClick={() => setTimeLeft(timeLeft + 15)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              +15s
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
