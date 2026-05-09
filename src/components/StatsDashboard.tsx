/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { FitnessLevel, LogEntry, User } from '../types';
import { ArrowLeft, TrendingUp, Calendar, Zap, Flame, Trophy, Sparkles, Loader2, Info } from 'lucide-react';
import { getProgressInsights } from '../services/geminiService';

interface StatsDashboardProps {
  onBack: () => void;
  logs: { [exerciseId: string]: LogEntry[] };
  user: User | null;
}

export default function StatsDashboard({ onBack, logs, user }: StatsDashboardProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (Object.keys(logs).length > 0) {
        setIsLoadingInsights(true);
        const data = await getProgressInsights(logs);
        setInsights(data);
        setIsLoadingInsights(false);
      }
    };
    fetchInsights();
  }, [logs]);

  // Process data for consistency (workouts per date)
  const allEntries = Object.values(logs).flat();
  const dateCounts: { [date: string]: number } = {};
  const dateVolumes: { [date: string]: number } = {};

  allEntries.forEach(entry => {
    const date = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateCounts[date] = (dateCounts[date] || 0) + 1;
    
    const volume = (entry.sets || []).reduce((acc, set) => acc + (set.reps * set.weight), 0);
    dateVolumes[date] = (dateVolumes[date] || 0) + volume;
  });

  const timeSeriesData = Object.keys(dateCounts).map(date => ({
    date,
    exercises: dateCounts[date],
    volume: dateVolumes[date]
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Process data for max weight per exercise
  const exerciseMaxes = Object.entries(logs).map(([id, entries]) => {
    const weights = entries.flatMap(e => (e.sets || []).map(s => s.weight || 0));
    const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
    const exerciseName = id.replace(/-/g, ' ').toUpperCase();
    return { name: exerciseName, weight: maxWeight };
  }).filter(e => e.weight > 0);

  return (
    <div className="flex flex-col min-h-screen bg-inherit transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-inherit backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 -ml-2 text-inherit hover:opacity-70 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl dark:text-inherit text-slate-900 leading-none">Progress Analytics</h1>
            {user?.role === 'admin' && (
              <span className="text-[8px] font-black bg-accent text-black px-2 py-0.5 rounded-full uppercase tracking-widest self-start mt-1">
                ADMIN
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* AI Insights Card */}
        <section className="bg-accent/10 border border-accent/20 p-6 rounded-[2.5rem] shadow-xl shadow-accent/5 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent text-black rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-black italic text-accent tracking-widest uppercase text-xs">AI Progress Insights</h2>
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Analyzing your performance data</p>
            </div>
          </div>
          
          {isLoadingInsights ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3 opacity-50">
              <Loader2 size={32} className="animate-spin text-accent" />
              <p className="text-xs font-bold uppercase tracking-widest">Calculating gains...</p>
            </div>
          ) : insights ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed opacity-80 italic">
                {insights}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-sm opacity-40 py-4">
              <Info size={16} />
              <p>Start logging your workouts to get personalized AI progress analysis.</p>
            </div>
          )}
        </section>

        {/* Volume Trend Card */}
        <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-accent/20 text-accent rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Training Volume Trend</h2>
              <p className="text-xs opacity-40 font-medium">Total weight moved (kg) per session</p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            {timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fffb00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fffb00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#fffb00" 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <TrendingUp size={32} className="opacity-20" />
                <p className="text-sm">Log weighted exercises to see volume trends</p>
              </div>
            )}
          </div>
        </section>

        {/* Consistency Card */}
        <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Workout Consistency</h2>
              <p className="text-xs opacity-40 font-medium">Exercises completed per day</p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            {timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="exercises" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Zap size={32} className="opacity-20" />
                <p className="text-sm">Start working out to see your streaks!</p>
              </div>
            )}
          </div>
        </section>

        {/* Max Weight Card */}
        <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-inherit">Personal Records</h2>
              <p className="text-xs text-inherit opacity-40">Max weight lifted per exercise (kg)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {exerciseMaxes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseMaxes} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: '#64748b', fontWeight: 'bold' }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="weight" radius={[0, 8, 8, 0]} barSize={20}>
                    {exerciseMaxes.map((entry, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? '#8b5cf6' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <TrendingUp size={32} className="opacity-20" />
                <p className="text-sm">Log your lifts to track your strength</p>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent p-4 rounded-3xl text-black shadow-lg shadow-accent/20">
            <div className="flex items-center space-x-2 mb-1">
              <Flame size={14} className="fill-current" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Current Streak</p>
            </div>
            <p className="text-3xl font-black">{user?.currentStreak || 0}d</p>
          </div>
          <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-3xl text-white shadow-lg shadow-black/20">
            <div className="flex items-center space-x-2 mb-1">
              <Trophy size={14} className="text-accent" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Personal Best</p>
            </div>
            <p className="text-3xl font-black">{user?.longestStreak || 0}d</p>
          </div>
          <div className="bg-blue-500 p-4 rounded-3xl text-white shadow-lg shadow-blue-500/20">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Exercises</p>
            <p className="text-3xl font-black">{allEntries.length}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-3xl dark:text-white text-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Active Days</p>
            <p className="text-3xl font-black">{Object.keys(dateCounts).length}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
