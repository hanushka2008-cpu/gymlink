import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCcw, Sparkles, Utensils, Zap, Activity, Info, ChevronRight, Loader2, Apple } from 'lucide-react';
import { analyzeFood, FoodAnalysis, getDietSuggestions } from '../services/dietService';

interface DietTrackerProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export default function DietTracker({ onClose, isDarkMode }: DietTrackerProps) {
  const [view, setView] = useState<'camera' | 'analysis' | 'suggestions'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dietTips, setDietTips] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (view === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [view]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        setView('analysis');
        handleAnalysis(dataUrl);
      }
    }
  };

  const handleAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      // Remove data URL prefix for Gemini
      const base64 = imageData.split(',')[1];
      const result = await analyzeFood(base64);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadDietTips = async () => {
    setView('suggestions');
    if (!dietTips) {
      const tips = await getDietSuggestions("Muscle weight gain", "Strict protein focus");
      setDietTips(tips);
    }
  };

  return (
    <div className="flex flex-col h-full bg-inherit pt-safe">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent rounded-xl text-black">
            <Apple size={24} />
          </div>
          <div>
            <h2 className={`text-xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              DIET TRACKER
            </h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              AI Calorie Meter
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

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <AnimatePresence mode="wait">
          {view === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col p-4 space-y-6"
            >
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-black border-4 border-white/10 shadow-2xl">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-[6px] border-accent shadow-xl active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 border-2 border-black/10 rounded-full" />
                  </button>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className={`font-bold italic uppercase tracking-widest text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Point camera at your meal
                </p>
                <p className="text-xs opacity-50">AI will automatically detect calories and macros</p>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <button 
                onClick={loadDietTips}
                className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/20 text-accent rounded-lg">
                    <Sparkles size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Diet Suggestions</p>
                    <p className="text-[10px] opacity-50 uppercase font-black">AI Recommendations</p>
                  </div>
                </div>
                <ChevronRight size={20} className="opacity-30" />
              </button>
            </motion.div>
          )}

          {view === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-8"
            >
               <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView('camera')}
                  className="flex items-center space-x-2 text-xs font-black italic text-accent uppercase tracking-widest"
                >
                  <RefreshCcw size={14} />
                  <span>Scan New</span>
                </button>
                {isAnalyzing && (
                  <div className="flex items-center space-x-2 text-accent">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-black italic uppercase tracking-widest">Analyzing...</span>
                  </div>
                )}
              </div>

              {capturedImage && (
                <div className="aspect-[16/9] rounded-3xl overflow-hidden border-2 border-white/10 shadow-lg">
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured food" />
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {analysis.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-6 rounded-[2rem] text-center space-y-1 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
                      <p className="text-4xl font-black italic tracking-tighter text-accent">{analysis.calories}</p>
                      <p className="text-[10px] font-black uppercase opacity-40">Total Calories</p>
                    </div>
                    <div className={`p-6 rounded-[2rem] text-center space-y-1 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
                      <p className="text-4xl font-black italic tracking-tighter text-blue-500">{analysis.protein}g</p>
                      <p className="text-[10px] font-black uppercase opacity-40">Protein</p>
                    </div>
                    <div className={`p-6 rounded-[2rem] text-center space-y-1 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
                      <p className="text-4xl font-black italic tracking-tighter text-orange-500">{analysis.carbs}g</p>
                      <p className="text-[10px] font-black uppercase opacity-40">Carbs</p>
                    </div>
                    <div className={`p-6 rounded-[2rem] text-center space-y-1 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
                      <p className="text-4xl font-black italic tracking-tighter text-yellow-500">{analysis.fat}g</p>
                      <p className="text-[10px] font-black uppercase opacity-40">Fat</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-black italic uppercase tracking-widest opacity-40">
                      <Sparkles size={14} />
                      <span>AI Diet Tips</span>
                    </div>
                    <div className="grid gap-3">
                      {analysis.suggestions.map((tip, i) => (
                        <div 
                          key={i}
                          className={`p-4 rounded-2xl flex items-start space-x-3 text-sm ${
                            isDarkMode ? 'bg-white/5' : 'bg-slate-100'
                          }`}
                        >
                          <Info size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <p className="leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 opacity-30">
                  <Utensils size={48} className="mx-auto mb-4" />
                  <p className="font-bold">Couldn't identify meal</p>
                  <p className="text-xs">Please try with a clearer photo</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-6"
            >
              <button 
                onClick={() => setView('camera')}
                className="flex items-center space-x-2 text-xs font-black italic text-accent uppercase tracking-widest"
              >
                <X size={14} />
                <span>Back to Camera</span>
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-accent/20 text-accent rounded-2xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      AI MEAL PLANNER
                    </h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Personalized for you</p>
                  </div>
                </div>

                <div className={`p-6 rounded-[2.5rem] min-h-[300px] leading-relaxed relative ${
                   isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'
                }`}>
                  {dietTips ? (
                    <div className="prose prose-invert text-sm">
                      <div className="whitespace-pre-wrap">{dietTips}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4 opacity-30 h-full">
                      <Loader2 size={32} className="animate-spin" />
                      <p className="font-bold uppercase tracking-widest text-xs">Cooking up advice...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
