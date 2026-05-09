import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Crown, Sparkles, CreditCard, Flame, Activity, Trophy } from 'lucide-react';

interface PaywallProps {
  onSubscribe: () => void;
  isDarkMode: boolean;
  accentColor: string;
}

export default function Paywall({ onSubscribe, isDarkMode, accentColor }: PaywallProps) {
  const features = [
    { icon: Flame, text: "Unlimited workout routines" },
    { icon: Activity, text: "Advanced progress tracking" },
    { icon: Trophy, text: "Personalized exercise variants" },
    { icon: Sparkles, text: "HD video tutorials & slow-mo" },
    { icon: Crown, text: "Ad-free coaching experience" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 pt-safe pb-safe">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center shadow-xl shadow-accent/20"
      >
        <Crown size={40} className="text-black" />
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          TRIAL EXPIRED
        </h2>
        <p className="text-slate-400 font-medium">Unlock the full power of GYMLINK</p>
      </div>

      <div className="w-full space-y-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center space-x-3 p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-200/50'}`}
          >
            <div className="text-accent">
              <feature.icon size={20} />
            </div>
            <span className="font-semibold text-sm opacity-90">{feature.text}</span>
            <CheckCircle2 size={16} className="ml-auto text-accent opacity-40" />
          </motion.div>
        ))}
      </div>

      <div className={`w-full p-6 rounded-3xl ${isDarkMode ? 'bg-accent/10 border border-accent/20' : 'bg-accent/5 border border-accent/10'} space-y-4`}>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Premium Plan</p>
            <h3 className="text-2xl font-black">$9.99<span className="text-sm opacity-50">/mo</span></h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold opacity-40 uppercase">Cancel anytime</p>
          </div>
        </div>

        <button
          onClick={onSubscribe}
          className="w-full py-4 bg-accent hover:bg-accent-deep text-black font-black italic rounded-2xl transition-all active:scale-95 shadow-lg shadow-accent/20 flex items-center justify-center space-x-2"
        >
          <CreditCard size={20} />
          <span>SUBSCRIBE NOW</span>
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] opacity-40 font-medium">By subscribing, you agree to our Terms and Privacy Policy.</p>
      </div>
    </div>
  );
}
