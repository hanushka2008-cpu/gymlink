/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, RotateCw, CheckCircle2, Circle, ChevronDown, ChevronUp, Copy, X, Share2, Heart } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string, logData?: { reps: number; weight: number }[]) => void;
  isCompleted: boolean;
  previousLog?: { reps: number; weight: number }[];
}

export default function ExerciseCard({ exercise, onComplete, isCompleted, previousLog }: ExerciseCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(exercise.variants?.[0]?.id || null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteExercises') || '[]');
      return Array.isArray(favorites) && favorites.includes(exercise.id);
    } catch (e) {
      console.error('Error reading favorites from localStorage', e);
      return false;
    }
  });

  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteExercises') || '[]');
      let newFavorites;
      if (isFavorite) {
        newFavorites = favorites.filter((id: any) => id !== exercise.id);
      } else {
        newFavorites = [...favorites, exercise.id];
      }
      localStorage.setItem('favoriteExercises', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error('Error saving favorite to localStorage', e);
    }
  };

  const activeExercise = exercise.variants?.find(v => v.id === selectedVariantId) || {
    name: exercise.name,
    description: exercise.description,
    videoUrl: exercise.videoUrl,
    thumbnailUrl: exercise.thumbnailUrl
  };

  const videoUrlWithApi = `${activeExercise.videoUrl}${activeExercise.videoUrl.includes('?') ? '&' : '?'}enablejsapi=1`;

  const sendCommand = (command: string, args: any[] = []) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args }),
        '*'
      );
    }
  };

  const [formReps, setFormReps] = useState<string[]>(() => 
    (previousLog && Array.isArray(previousLog)) ? previousLog.map(s => s.reps?.toString() || '0') : Array(exercise.sets || 0).fill('')
  );
  const [formWeight, setFormWeight] = useState<string[]>(() => 
    (previousLog && Array.isArray(previousLog)) ? previousLog.map(s => s.weight?.toString() || '0') : Array(exercise.sets || 0).fill('')
  );

  useEffect(() => {
    if (previousLog && Array.isArray(previousLog)) {
      setFormReps(previousLog.map(s => s.reps?.toString() || '0'));
      setFormWeight(previousLog.map(s => s.weight?.toString() || '0'));
    }
  }, [previousLog]);

  useEffect(() => {
    setShowVideo(false);
  }, [selectedVariantId]);

  const handleLog = () => {
    const logData = formReps.map((r, i) => ({
      reps: parseInt(r) || 0,
      weight: parseInt(formWeight[i]) || 0
    }));
    onComplete(exercise.id, logData);
  };

  const handleShare = async () => {
    const shareData = {
      title: activeExercise.name,
      text: `${activeExercise.name} - ${activeExercise.description}`,
      url: activeExercise.videoUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `${shareData.title}\n${shareData.text}\nWatch: ${shareData.url}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert('Exercise info copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const getDifficulty = () => {
    const totalVolume = exercise.sets * (parseInt(exercise.reps) || 10);
    if (totalVolume < 25) return { label: 'Low Intensity', color: 'bg-green-100 text-green-700' };
    if (totalVolume < 45) return { label: 'Moderate', color: 'bg-orange-100 text-orange-700' };
    return { label: 'High Intensity', color: 'bg-red-100 text-red-700' };
  };

  const difficulty = getDifficulty();

  // Helper for dynamic accent colors
  const accentClass = exercise.variants?.length ? 'blue' : 'blue'; // Just a placeholder, better to use props or global state

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/10 dark:border-slate-800/20 mb-4 transition-colors duration-300" id={`exercise-${exercise.id}`}>
      {/* Thumbnail Header - Always Visible */}
      <div className="relative h-48 bg-slate-200 dark:bg-slate-800">
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${difficulty.color}`}>
            {difficulty.label}
          </span>
        </div>
        <div className="relative h-full w-full group cursor-pointer" onClick={() => setShowVideo(!showVideo)}>
          <img
            src={activeExercise.thumbnailUrl}
            alt={activeExercise.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 flex items-center justify-center transition-all ${showVideo ? 'bg-black/60' : 'bg-black/20 group-hover:bg-black/10'}`}>
            <div className={`p-4 bg-white/20 backdrop-blur-md rounded-full transition-all ${showVideo ? 'rotate-90 scale-90 opacity-0' : 'group-hover:scale-110'}`}>
              <Play className="text-white fill-white" size={32} />
            </div>
            {showVideo && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-white font-black text-xs uppercase tracking-widest bg-accent px-4 py-2 rounded-full shadow-lg"
              >
                Watching Tutorial
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player Section - Appears below thumbnail */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 280, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative bg-black group overflow-hidden"
          >
            <iframe
              ref={iframeRef}
              src={videoUrlWithApi}
              title={activeExercise.name}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Close Video"
            >
              <X size={16} />
            </button>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center space-y-4">
                {/* Playback Speed Control */}
                <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-lg p-1 pointer-events-auto">
                  {[0.5, 0.75, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        sendCommand('setPlaybackRate', [speed]);
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                        playbackSpeed === speed 
                          ? 'bg-accent text-white' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-6 pointer-events-auto">
                  <button 
                    onClick={() => sendCommand('seekTo', [0, true])}
                    className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95"
                    title="Restart"
                  >
                    <RotateCcw size={24} />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => sendCommand('pauseVideo')}
                      className="p-4 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95"
                      title="Pause"
                    >
                      <Pause size={32} fill="currentColor" />
                    </button>
                    <button 
                      onClick={() => sendCommand('playVideo')}
                      className="p-5 bg-accent hover:bg-accent-deep rounded-full text-white shadow-xl shadow-accent/40 transition-all hover:scale-110 active:scale-95"
                      title="Play"
                    >
                      <Play size={40} fill="currentColor" />
                    </button>
                  </div>
                  <button 
                    onClick={() => sendCommand('seekTo', [30, true])}
                    className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95"
                    title="Skip to 30s"
                  >
                    <RotateCw size={24} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4">
        {exercise.variants && exercise.variants.length > 0 && (
          <div className="flex space-x-1 mb-4 bg-white/5 dark:bg-rose-950/20 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {exercise.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap transition-all ${
                  selectedVariantId === v.id 
                    ? 'bg-accent text-black shadow-sm' 
                    : 'text-inherit opacity-40 hover:opacity-100'
                }`}
              >
                {v.name.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-xl leading-tight text-inherit">{activeExercise.name}</h3>
              <div className="flex items-center">
                <button
                  onClick={toggleFavorite}
                  className={`p-1.5 transition-all active:scale-125 ${
                    isFavorite ? 'text-red-500 fill-red-500' : 'text-inherit opacity-60 hover:opacity-100'
                  }`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-inherit opacity-60 hover:opacity-100 transition-colors"
                  title="Share Exercise"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mt-1 text-sm text-inherit opacity-60 font-medium">
              <span>{exercise.sets} Sets</span>
              <span>•</span>
              <span>{exercise.reps} Reps</span>
            </div>
          </div>
          <button
            onClick={handleLog}
            className={`p-2 rounded-full transition-colors ${
              isCompleted ? 'text-green-500' : 'text-slate-300 dark:text-rose-950 hover:text-rose-500'
            }`}
          >
            {isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="text-xs font-bold text-inherit opacity-40 w-8">SET {i + 1}</span>
              <div className="flex-1 flex space-x-2">
                <input
                  type="number"
                  placeholder="Reps"
                  value={formReps[i]}
                  onChange={(e) => {
                    const newReps = [...formReps];
                    newReps[i] = e.target.value;
                    setFormReps(newReps);
                  }}
                  className="w-full bg-white/5 dark:bg-rose-950/20 border border-white/10 dark:border-rose-900/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 text-inherit"
                />
                <input
                  type="number"
                  placeholder="Kg"
                  value={formWeight[i]}
                  onChange={(e) => {
                    const newWeight = [...formWeight];
                    newWeight[i] = e.target.value;
                    setFormWeight(newWeight);
                  }}
                  className="w-full bg-white/5 dark:bg-rose-950/20 border border-white/10 dark:border-rose-900/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 text-inherit"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (i > 0) {
                    const newReps = [...formReps];
                    const newWeight = [...formWeight];
                    newReps[i] = formReps[i - 1];
                    newWeight[i] = formWeight[i - 1];
                    setFormReps(newReps);
                    setFormWeight(newWeight);
                  }
                }}
                className={`p-2 rounded-lg transition-all ${
                  i === 0 
                    ? 'opacity-0 cursor-default' 
                    : 'text-inherit opacity-40 hover:text-accent hover:opacity-100 active:scale-95'
                }`}
                title="Repeat previous set"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-xs font-semibold text-inherit opacity-40 mt-4 uppercase tracking-wider hover:opacity-100"
        >
          Details {isExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-inherit opacity-60 text-sm mt-2 leading-relaxed">
                {activeExercise.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
