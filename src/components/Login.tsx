import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, LogIn, ShieldCheck, X, RefreshCcw, Loader2 } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
  accentColor: string;
}

export default function Login({ onLogin, isDarkMode, accentColor }: LoginProps) {
  const [method, setMethod] = useState<'options' | 'qr'>('options');
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  
  // Mock session ID for QR
  const sessionId = "gymlink-" + Math.random().toString(36).substring(7);

  const simulateQRLogin = () => {
    setIsSimulatingScan(true);
    setScanStatus('scanning');
    
    // Simulate someone scanning the code after 3 seconds
    setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => {
        onLogin({
          id: 'user-123',
          name: 'Alex Johnson',
          email: 'hanushka2008@gmail.com',
          avatarUrl: 'https://i.pravatar.cc/150?u=admin',
          role: 'admin',
          currentStreak: 5,
          longestStreak: 12,
          lastActiveDate: new Date(Date.now() - 86400000).toISOString() // Active yesterday
        });
      }, 1000);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 min-h-[80vh] pt-safe pb-safe">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
          <QrCode size={32} className="text-black" />
        </div>
        <h2 className={`text-4xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          WELCOME BACK
        </h2>
        <p className="text-slate-400 font-medium">Log in to sync your progress</p>
      </motion.div>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {method === 'options' ? (
            <motion.div
              key="options"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setMethod('qr')}
                className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center space-x-4 group ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:border-accent hover:bg-accent/5' 
                    : 'bg-slate-100 border-slate-200 hover:border-accent hover:bg-accent/5'
                }`}
              >
                <div className="p-3 bg-accent rounded-2xl text-black group-hover:scale-110 transition-transform">
                  <QrCode size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black italic text-lg tracking-tight">QR CODE LOGIN</p>
                  <p className="text-xs opacity-50 font-bold uppercase">Scan with mobile app</p>
                </div>
              </button>

              <button
                onClick={() => onLogin({
                  id: 'user-guest',
                  name: 'Guest User',
                  email: 'guest@gymlink.fit',
                  avatarUrl: 'https://i.pravatar.cc/150?u=guest',
                  role: 'member',
                  currentStreak: 0,
                  longestStreak: 0
                })}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-center space-x-2 font-bold ${
                  isDarkMode 
                    ? 'border-white/10 text-white/60 hover:text-white hover:bg-white/5' 
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LogIn size={18} />
                <span>Continue as Guest</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="qr"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col items-center space-y-8"
            >
              <div className={`p-6 rounded-[2.5rem] ${isDarkMode ? 'bg-white' : 'bg-white shadow-2xl shadow-accent/10'} relative overflow-hidden group`}>
                <QRCodeSVG 
                  value={sessionId} 
                  size={200}
                  fgColor="#000"
                  level="H"
                  includeMargin={false}
                />
                
                {scanStatus !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-accent space-y-4"
                  >
                    {scanStatus === 'scanning' ? (
                      <>
                        <Loader2 size={48} className="animate-spin" />
                        <p className="font-black italic text-sm tracking-widest text-white uppercase">Validating Scan...</p>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={48} className="text-accent" />
                        <p className="font-black italic text-sm tracking-widest text-accent uppercase">Authorized!</p>
                      </>
                    )}
                  </motion.div>
                )}
                
                <div className="absolute inset-0 border-[12px] border-accent/0 pointer-events-none transition-all group-hover:border-accent/10" />
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                  <Smartphone size={14} />
                  <span>Scan this with your phone</span>
                </div>
                
                {scanStatus === 'idle' && (
                  <button
                    onClick={simulateQRLogin}
                    className="px-6 py-2 bg-accent/20 text-accent rounded-full text-xs font-black italic border border-accent/30 hover:bg-accent hover:text-black transition-all active:scale-95"
                  >
                    SIMULATE SCAN
                  </button>
                )}
              </div>

              <button
                onClick={() => setMethod('options')}
                className="text-xs font-black italic opacity-40 hover:opacity-100 transition-opacity flex items-center space-x-2 uppercase tracking-widest"
              >
                <RefreshCcw size={14} />
                <span>Choose other method</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center space-x-4 opacity-30">
        <Smartphone size={20} />
        <div className="h-4 w-[1px] bg-current" />
        <LogIn size={20} />
        <div className="h-4 w-[1px] bg-current" />
        <ShieldCheck size={20} />
      </div>
    </div>
  );
}
