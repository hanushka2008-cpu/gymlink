/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkoutRoutine, Exercise } from './types';

// Exercise Pool to draw from
const EXERCISE_POOL: { [key: string]: Exercise } = {
  // Chest
  pushups: {
    id: 'pushups',
    name: 'Push-ups',
    description: 'Classic chest and tricep builder.',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    sets: 3, reps: '12-15',
    thumbnailUrl: 'https://picsum.photos/seed/pushups/400/225',
    variants: [
      {
        id: 'pushups-std',
        name: 'Standard',
        description: 'Traditional push-up focusing on chest, shoulders, and triceps.',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        thumbnailUrl: 'https://picsum.photos/seed/pushups/400/225'
      },
      {
        id: 'pushups-diamond',
        name: 'Diamond',
        description: 'Hands close together to form a diamond, shifting focus to triceps.',
        videoUrl: 'https://www.youtube.com/embed/J0DnG1_S92I',
        thumbnailUrl: 'https://picsum.photos/seed/diamond-push/400/225'
      },
      {
        id: 'pushups-wide',
        name: 'Wide Grip',
        description: 'Hands wider than shoulders to maximize chest engagement.',
        videoUrl: 'https://www.youtube.com/embed/rr6eFNNDQdg',
        thumbnailUrl: 'https://picsum.photos/seed/wide-push/400/225'
      }
    ]
  },
  bench_press: {
    id: 'bench_press',
    name: 'Barbell Bench Press',
    description: 'The king of chest exercises.',
    videoUrl: 'https://www.youtube.com/embed/vcBig73ojpE',
    sets: 4, reps: '8-10',
    thumbnailUrl: 'https://picsum.photos/seed/bench-press/400/225'
  },
  db_fly: {
    id: 'db_fly',
    name: 'Dumbbell Flys',
    description: 'Isolation for the chest muscles.',
    videoUrl: 'https://www.youtube.com/embed/eozdVmS8M0g',
    sets: 3, reps: '12',
    thumbnailUrl: 'https://picsum.photos/seed/db-fly/400/225'
  },
  // Back
  pullups: {
    id: 'pullups',
    name: 'Pull-ups',
    description: 'Broaden your back.',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    sets: 3, reps: 'Max',
    thumbnailUrl: 'https://picsum.photos/seed/pullups/400/225'
  },
  deadlift: {
    id: 'deadlift',
    name: 'Deadlift',
    description: 'Ultimate posterior chain strength.',
    videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
    sets: 5, reps: '5',
    thumbnailUrl: 'https://picsum.photos/seed/deadlift/400/225'
  },
  rows: {
    id: 'rows',
    name: 'Bent Over Rows',
    description: 'Build thick back muscles.',
    videoUrl: 'https://www.youtube.com/embed/6TSzgzY_vvo',
    sets: 4, reps: '10',
    thumbnailUrl: 'https://picsum.photos/seed/rows/400/225'
  },
  // Legs
  squats: {
    id: 'squats',
    name: 'Barbell Squats',
    description: 'Foundation for leg strength.',
    videoUrl: 'https://www.youtube.com/embed/gcNh17Ckjgg',
    sets: 4, reps: '8-12',
    thumbnailUrl: 'https://picsum.photos/seed/squats/400/225',
    variants: [
      {
        id: 'squats-std',
        name: 'Standard',
        description: 'Traditional barbell back squat.',
        videoUrl: 'https://www.youtube.com/embed/gcNh17Ckjgg',
        thumbnailUrl: 'https://picsum.photos/seed/squats/400/225'
      },
      {
        id: 'squats-jump',
        name: 'Jump Squat',
        description: 'Explosive version to build power and speed.',
        videoUrl: 'https://www.youtube.com/embed/Azl5tkCzDcc',
        thumbnailUrl: 'https://picsum.photos/seed/jumpsquat/400/225'
      },
      {
        id: 'squats-goblet',
        name: 'Goblet Squat',
        description: 'Holding a weight at chest level, easier on the back.',
        videoUrl: 'https://www.youtube.com/embed/MeIiIdhvXT4',
        thumbnailUrl: 'https://picsum.photos/seed/goblet/400/225'
      }
    ]
  },
  lunges: {
    id: 'lunges',
    name: 'Walking Lunges',
    description: 'Unilateral leg development.',
    videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    sets: 3, reps: '12 each leg',
    thumbnailUrl: 'https://picsum.photos/seed/lunges/400/225'
  },
  leg_press: {
    id: 'leg_press',
    name: 'Leg Press',
    description: 'Focus on quad intensity.',
    videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
    sets: 4, reps: '15',
    thumbnailUrl: 'https://picsum.photos/seed/leg-press/400/225'
  },
  // Shoulders
  ohp: {
    id: 'ohp',
    name: 'Overhead Press',
    description: 'Build massive shoulders.',
    videoUrl: 'https://www.youtube.com/embed/2yjwHeEdf9M',
    sets: 4, reps: '8',
    thumbnailUrl: 'https://picsum.photos/seed/ohp/400/225'
  },
  lateral_raise: {
    id: 'lateral_raise',
    name: 'Lateral Raises',
    description: 'For that shoulder width.',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    sets: 3, reps: '15',
    thumbnailUrl: 'https://picsum.photos/seed/lateral-raise/400/225'
  },
  // Arms
  bicep_curl: {
    id: 'bicep_curl',
    name: 'Barbell Curls',
    description: 'Peak bicep development.',
    videoUrl: 'https://www.youtube.com/embed/kwG2V6BAY20',
    sets: 3, reps: '12',
    thumbnailUrl: 'https://picsum.photos/seed/curl/400/225'
  },
  tricep_ext: {
    id: 'tricep_ext',
    name: 'Tricep Pushdowns',
    description: 'Target the long head.',
    videoUrl: 'https://www.youtube.com/embed/2-LAMcpzHLU',
    sets: 3, reps: '12',
    thumbnailUrl: 'https://picsum.photos/seed/tricep/400/225'
  }
};

const generateRoutines = () => {
  const routines: WorkoutRoutine[] = [];

  // Beginner: 31 days (Cycle A/B full body)
  const begA = [EXERCISE_POOL.pushups, EXERCISE_POOL.rows, EXERCISE_POOL.squats];
  const begB = [EXERCISE_POOL.ohp, EXERCISE_POOL.deadlift, EXERCISE_POOL.lunges];
  
  for (let i = 1; i <= 31; i++) {
    const isRest = i % 2 === 0; // Rest every other day
    routines.push({
      id: `beg-day-${i}`,
      name: isRest ? 'Active Recovery' : (i % 4 === 1 ? 'Beginner Full Body A' : 'Beginner Full Body B'),
      level: 'beginner',
      day: i,
      exercises: isRest ? [] : (i % 4 === 1 ? begA : begB).map(e => ({...e, id: `${e.id}-beg-${i}`}))
    });
  }

  // Intermediate: 31 days (Push / Pull / Legs / Rest)
  const push = [EXERCISE_POOL.bench_press, EXERCISE_POOL.ohp, EXERCISE_POOL.tricep_ext];
  const pull = [EXERCISE_POOL.pullups, EXERCISE_POOL.rows, EXERCISE_POOL.bicep_curl];
  const legs = [EXERCISE_POOL.squats, EXERCISE_POOL.lunges, EXERCISE_POOL.leg_press];

  for (let i = 1; i <= 31; i++) {
    const cycle = i % 4;
    let dayExercises: Exercise[] = [];
    let name = '';
    
    if (cycle === 1) { name = 'Push Day'; dayExercises = push; }
    else if (cycle === 2) { name = 'Pull Day'; dayExercises = pull; }
    else if (cycle === 3) { name = 'Leg Day'; dayExercises = legs; }
    else { name = 'Rest & Stretch'; dayExercises = []; }

    routines.push({
      id: `int-day-${i}`,
      name: name,
      level: 'intermediate',
      day: i,
      exercises: dayExercises.map(e => ({...e, id: `${e.id}-int-${i}`}))
    });
  }

  // Advanced: 90 days (Push/Pull/Legs/Upper/Lower/Rest)
  for (let i = 1; i <= 90; i++) {
    const cycle = i % 6;
    let dayExercises: Exercise[] = [];
    let name = '';

    if (cycle === 1) { name = 'Push Power'; dayExercises = [EXERCISE_POOL.bench_press, EXERCISE_POOL.ohp, EXERCISE_POOL.tricep_ext, EXERCISE_POOL.pushups]; }
    else if (cycle === 2) { name = 'Pull Power'; dayExercises = [EXERCISE_POOL.deadlift, EXERCISE_POOL.pullups, EXERCISE_POOL.rows, EXERCISE_POOL.bicep_curl]; }
    else if (cycle === 3) { name = 'Leg Power'; dayExercises = [EXERCISE_POOL.squats, EXERCISE_POOL.leg_press, EXERCISE_POOL.lunges]; }
    else if (cycle === 4) { name = 'Upper Hypertrophy'; dayExercises = [EXERCISE_POOL.db_fly, EXERCISE_POOL.rows, EXERCISE_POOL.lateral_raise, EXERCISE_POOL.bicep_curl]; }
    else if (cycle === 5) { name = 'Lower Hypertrophy'; dayExercises = [EXERCISE_POOL.squats, EXERCISE_POOL.lunges, EXERCISE_POOL.leg_press]; }
    else { name = 'Complete Recovery'; dayExercises = []; }

    routines.push({
      id: `adv-day-${i}`,
      name: name,
      level: 'advanced',
      day: i,
      exercises: dayExercises.map(e => ({...e, id: `${e.id}-adv-${i}`}))
    });
  }

  return routines;
};

export const WORKOUT_ROUTINES: WorkoutRoutine[] = generateRoutines();

export const ADMIN_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'New Feature: Exercise Variants',
    content: 'You can now select different variants for push-ups and squats! Check them out in your next workout.',
    date: '2026-05-08T10:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Subscription Benefits',
    content: 'Subscribe now to unlock exclusive features and higher quality workout videos.',
    date: '2026-05-09T09:00:00Z',
  },
  {
    id: 'ann-3',
    title: 'Upcoming: Community Challenges',
    content: 'We are working on bringing you monthly fitness challenges soon. Stay tuned!',
    date: '2026-05-09T12:00:00Z',
  }
];

