/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sun, Moon, Check } from 'lucide-react';

interface ThemeSettingsProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  accentColor: string;
  setAccentColor: (val: string) => void;
  textColor: string;
  setTextColor: (val: string) => void;
}

export default function ThemeSettings({ 
  isDarkMode, 
  setIsDarkMode, 
  accentColor, 
  setAccentColor,
  textColor,
  setTextColor
}: ThemeSettingsProps) {
  const colors = [
    { id: 'rose', class: 'bg-rose-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'amber', class: 'bg-amber-500' },
    { id: 'red', class: 'bg-red-500' },
    { id: 'white', class: 'bg-white' }
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="px-6 mb-8 overflow-hidden"
    >
      <div className={`p-4 rounded-3xl ${isDarkMode ? 'bg-black/60 border border-rose-900/40' : 'bg-white/60 border border-white/40'} backdrop-blur-md shadow-sm space-y-6`}>
        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest opacity-60 dark:text-rose-400">Display Mode</span>
          <div className={`flex p-1 rounded-full ${isDarkMode ? 'bg-rose-950/20' : 'bg-slate-100'}`}>
            <button
              onClick={() => setIsDarkMode(false)}
              className={`p-2 rounded-full transition-all ${!isDarkMode ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}
            >
              <Sun size={18} />
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-rose-900 text-black shadow-sm' : 'text-slate-400'}`}
            >
              <Moon size={18} />
            </button>
          </div>
        </div>

        {/* Color Options */}
        <div className="space-y-3">
          <span className="text-sm font-bold uppercase tracking-widest opacity-60 block dark:text-rose-400">Accent Color</span>
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={`relative aspect-square rounded-2xl ${color.class} transition-all active:scale-95 flex items-center justify-center`}
              >
                {accentColor === color.id && (
                  <motion.div layoutId="check" className="text-white">
                    <Check size={20} strokeWidth={4} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text Color Options */}
        <div className="space-y-3">
          <span className="text-sm font-bold uppercase tracking-widest opacity-60 block dark:text-rose-400">Text Color</span>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => (
              <button
                key={`text-${color.id}`}
                onClick={() => setTextColor(color.id)}
                className={`relative aspect-square rounded-full border border-white/10 ${color.class} transition-all active:scale-95 flex items-center justify-center`}
                title={`Text: ${color.id}`}
              >
                {textColor === color.id && (
                  <motion.div layoutId="text-check" className={color.id === 'white' ? 'text-black' : 'text-white'}>
                    <Check size={14} strokeWidth={4} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
