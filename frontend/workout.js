// Workout Manager - Handles workout functionality, timers, and tracking
// Includes Supabase integration for cloud data storage

// ==================== SUPABASE INTEGRATION ====================

let supabaseUserId = null;

// Get user ID from localStorage (set after login)
function getSupabaseUserId() {
  if (!supabaseUserId) {
    supabaseUserId = localStorage.getItem('nutrimind_supabase_user_id');
  }
  return supabaseUserId;
}

// Save workout to Supabase
async function saveWorkoutToSupabase(workout) {
  const userId = getSupabaseUserId();
  if (!userId || !window.SupabaseDB) {
    console.log('Supabase not available, using localStorage only');
    return false;
  }

  try {
    await SupabaseDB.saveWorkout(userId, {
      workoutType: workout.workout_type || workout.id,
      title: workout.title,
      duration: workout.duration,
      calories: workout.calories || 0,
      completed: true,
      completedAt: new Date().toISOString()
    });
    console.log('Workout saved to Supabase');
    return true;
  } catch (error) {
    console.error('Error saving workout to Supabase:', error);
    return false;
  }
}

// ==================== WORKOUT DATA ====================

const WORKOUT_DATA = {
  'full-body-strength': {
    id: 'full-body-strength',
    title: 'Full Body Strength',
    icon: '🏋️',
    duration: 45,
    calories: 320,
    difficulty: 'Intermediate',
    description: 'Complete full body strength training workout',
    exercises: [
      { name: 'Warm Up', duration: 300, type: 'rest' },
      { name: 'Squats', sets: 3, reps: 12, rest: 60, type: 'strength' },
      { name: 'Push-ups', sets: 3, reps: 10, rest: 60, type: 'strength' },
      { name: 'Lunges', sets: 3, reps: 10, rest: 60, type: 'strength' },
      { name: 'Plank', duration: 45, rest: 30, type: 'core' },
      { name: 'Dumbbell Rows', sets: 3, reps: 12, rest: 60, type: 'strength' },
      { name: 'Cool Down', duration: 300, type: 'rest' }
    ]
  },
  'morning-run': {
    id: 'morning-run',
    title: 'Morning Run',
    icon: '🏃',
    duration: 30,
    calories: 280,
    difficulty: 'Beginner',
    description: 'Easy pace outdoor run',
    exercises: [
      { name: 'Warm Up Walk', duration: 180, type: 'cardio' },
      { name: 'Run - Easy Pace', duration: 1200, type: 'cardio' },
      { name: 'Walk', duration: 60, type: 'rest' },
      { name: 'Run - Moderate', duration: 300, type: 'cardio' },
      { name: 'Cool Down Walk', duration: 180, type: 'rest' }
    ]
  },
  'yoga-flow': {
    id: 'yoga-flow',
    title: 'Yoga Flow',
    icon: '🧘',
    duration: 20,
    calories: 95,
    difficulty: 'All Levels',
    description: 'Relaxing yoga session',
    exercises: [
      { name: 'Child\'s Pose', duration: 60, type: 'flexibility' },
      { name: 'Cat-Cow Stretch', duration: 60, type: 'flexibility' },
      { name: 'Downward Dog', duration: 45, type: 'flexibility' },
      { name: 'Warrior I', duration: 45, type: 'flexibility' },
      { name: 'Warrior II', duration: 45, type: 'flexibility' },
      { name: 'Tree Pose', duration: 60, type: 'flexibility' },
      { name: 'Triangle Pose', duration: 45, type: 'flexibility' },
      { name: 'Seated Forward Bend', duration: 60, type: 'flexibility' },
      { name: 'Corpse Pose', duration: 120, type: 'rest' }
    ]
  },
  'hiit-blast': {
    id: 'hiit-blast',
    title: 'HIIT Blast',
    icon: '⚡',
    duration: 25,
    calories: 380,
    difficulty: 'Advanced',
    description: 'High intensity interval training',
    exercises: [
      { name: 'Warm Up', duration: 120, type: 'rest' },
      { name: 'Burpees', duration: 20, rest: 10, type: 'hiit', rounds: 8 },
      { name: 'Mountain Climbers', duration: 20, rest: 10, type: 'hiit', rounds: 8 },
      { name: 'Jump Squats', duration: 20, rest: 10, type: 'hiit', rounds: 8 },
      { name: 'High Knees', duration: 20, rest: 10, type: 'hiit', rounds: 8 },
      { name: 'Cool Down', duration: 180, type: 'rest' }
    ]
  },
  'upper-body-focus': {
    id: 'upper-body-focus',
    title: 'Upper Body Focus',
    icon: '💪',
    duration: 40,
    calories: 290,
    difficulty: 'Intermediate',
    description: 'Target chest, back, and arms',
    exercises: [
      { name: 'Warm Up', duration: 180, type: 'rest' },
      { name: 'Push-ups', sets: 4, reps: 12, rest: 60, type: 'strength' },
      { name: 'Dumbbell Press', sets: 3, reps: 10, rest: 60, type: 'strength' },
      { name: 'Bent Over Rows', sets: 3, reps: 12, rest: 60, type: 'strength' },
      { name: 'Shoulder Press', sets: 3, reps: 10, rest: 60, type: 'strength' },
      { name: 'Bicep Curls', sets: 3, reps: 12, rest: 45, type: 'strength' },
      { name: 'Tricep Dips', sets: 3, reps: 10, rest: 45, type: 'strength' },
      { name: 'Cool Down', duration: 180, type: 'rest' }
    ]
  },
  'cycling-adventure': {
    id: 'cycling-adventure',
    title: 'Cycling Adventure',
    icon: '🚴',
    duration: 50,
    calories: 450,
    difficulty: 'Intermediate',
    description: 'Outdoor cycling with hill intervals',
    exercises: [
      { name: 'Warm Up', duration: 300, type: 'cardio' },
      { name: 'Steady Pace', duration: 600, type: 'cardio' },
      { name: 'Hill Intervals', duration: 900, type: 'cardio' },
      { name: 'Recovery Spin', duration: 180, type: 'cardio' },
      { name: 'Sprint Intervals', duration: 300, type: 'cardio' },
      { name: 'Cool Down', duration: 300, type: 'rest' }
    ]
  }
};

// ==================== STORAGE KEYS ====================

const WORKOUT_STORAGE = {
  COMPLETED: 'nutrimind_completed_workouts',
  STATS: 'nutrimind_workout_stats',
  CURRENT: 'nutrimind_current_workout'
};

// ==================== STATE ====================

let currentWorkout = null;
let currentExerciseIndex = 0;
let timerInterval = null;
let timeRemaining = 0;
let isPaused = false;
let exerciseStartTime = 0;

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
  initializeWorkoutButtons();
  loadWorkoutStats();
});

function initializeWorkoutButtons() {
  const workoutButtons = document.querySelectorAll('.workout-btn');
  workoutButtons.forEach(btn => {
    btn.addEventListener('click', handleStartWorkout);
  });
}

// ==================== WORKOUT HANDLERS ====================

function handleStartWorkout(event) {
  const workoutCard = event.target.closest('.workout-card');
  
  // First try to get workout ID from data attribute
  const workoutId = workoutCard.dataset.workoutId;
  
  if (workoutId && WORKOUT_DATA[workoutId]) {
    startWorkout(WORKOUT_DATA[workoutId]);
  } else {
    // Fallback: get title from the card
    const workoutTitle = workoutCard.querySelector('.workout-title').textContent;
    const matchedId = Object.keys(WORKOUT_DATA).find(key => 
      WORKOUT_DATA[key].title === workoutTitle
    );
    
    if (matchedId) {
      startWorkout(WORKOUT_DATA[matchedId]);
    } else {
      // Last fallback: create simple workout
      startSimpleWorkout(workoutTitle, workoutCard);
    }
  }
}

function startSimpleWorkout(title, card) {
  const meta = card.querySelector('.workout-meta').textContent;
  const difficulty = card.querySelector('.workout-difficulty').textContent;
  const calories = card.querySelector('.workout-detail span:first-child').textContent.replace('🔥 ', '').replace(' kcal', '');
  
  const simpleWorkout = {
    id: title.toLowerCase().replace(/\s+/g, '-'),
    title: title,
    icon: '🏋️',
    duration: parseInt(meta.split(' ')[0]) || 30,
    calories: parseInt(calories) || 200,
    difficulty: difficulty,
    description: title,
    exercises: [
      { name: 'Warm Up', duration: 180, type: 'rest' },
      { name: 'Exercise 1', duration: 300, type: 'strength' },
      { name: 'Rest', duration: 60, type: 'rest' },
      { name: 'Exercise 2', duration: 300, type: 'strength' },
      { name: 'Rest', duration: 60, type: 'rest' },
      { name: 'Exercise 3', duration: 300, type: 'strength' },
      { name: 'Cool Down', duration: 180, type: 'rest' }
    ]
  };
  
  startWorkout(simpleWorkout);
}

function startWorkout(workout) {
  currentWorkout = workout;
  currentExerciseIndex = 0;
  isPaused = false;
  
  // Save current workout to localStorage
  saveCurrentWorkout();
  
  // Show the workout modal
  showWorkoutModal();
  
  // Start the first exercise
  startExercise();
}

function showWorkoutModal() {
  // Check if modal already exists
  let modal = document.getElementById('workoutModal');
  if (!modal) {
    createWorkoutModal();
    modal = document.getElementById('workoutModal');
  }
  
  // Update modal content
  updateModalContent();
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideWorkoutModal() {
  const modal = document.getElementById('workoutModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Clear timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Clear current workout
  localStorage.removeItem(WORKOUT_STORAGE.CURRENT);
}

function createWorkoutModal() {
  const modalHTML = `
    <div id="workoutModal" class="workout-modal">
      <div class="workout-modal-content">
        <div class="workout-modal-header">
          <button class="workout-close" onclick="cancelWorkout()">✕</button>
          <div class="workout-title-section">
            <span id="workoutIcon" class="workout-icon-large"></span>
            <h2 id="workoutTitle"></h2>
          </div>
          <div class="workout-progress">
            <span id="exerciseProgress">1/7</span>
          </div>
        </div>
        
        <div class="workout-timer-section">
          <div id="exerciseName" class="exercise-name"></div>
          <div id="timerDisplay" class="timer-display">00:00</div>
          <div id="exerciseType" class="exercise-type"></div>
        </div>
        
        <div class="workout-controls">
          <button id="pauseBtn" class="workout-control-btn" onclick="togglePause()">
            <span id="pauseIcon">⏸️</span>
          </button>
        </div>
        
        <div class="workout-exercise-list">
          <h3>Exercises</h3>
          <div id="exerciseList" class="exercise-items"></div>
        </div>
        
        <div class="workout-actions">
          <button class="btn-cancel" onclick="cancelWorkout()">Cancel</button>
          <button id="skipBtn" class="btn-skip" onclick="skipExercise()">Skip →</button>
        </div>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .workout-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
    }
    .workout-modal.active {
      display: flex;
    }
    .workout-modal-content {
      background: var(--card, #16161f);
      border-radius: 24px;
      width: 90%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid var(--border, rgba(255,255,255,0.07));
    }
    .workout-modal-header {
      padding: 24px;
      border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
      position: relative;
    }
    .workout-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--card2, #1c1c28);
      border: none;
      color: var(--text, #f0f0f8);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .workout-close:hover {
      background: var(--accent3, #ff6b6b);
    }
    .workout-title-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .workout-icon-large {
      font-size: 32px;
      width: 56px;
      height: 56px;
      background: rgba(200,241,53,0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #workoutTitle {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
    .workout-progress {
      margin-top: 12px;
      font-size: 13px;
      color: var(--accent, #c8f135);
    }
    .workout-timer-section {
      padding: 40px 24px;
      text-align: center;
      background: linear-gradient(180deg, rgba(200,241,53,0.05) 0%, transparent 100%);
    }
    .exercise-name {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .timer-display {
      font-family: 'Syne', sans-serif;
      font-size: 64px;
      font-weight: 800;
      color: var(--accent, #c8f135);
      letter-spacing: -2px;
    }
    .exercise-type {
      margin-top: 12px;
      font-size: 13px;
      color: var(--muted, #7a7a9a);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .workout-controls {
      display: flex;
      justify-content: center;
      padding: 20px;
      gap: 16px;
    }
    .workout-control-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      background: var(--accent, #c8f135);
      color: #0a0a0f;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background 0.2s;
    }
    .workout-control-btn:hover {
      transform: scale(1.1);
      background: #d4ff4a;
    }
    .workout-exercise-list {
      padding: 0 24px 24px;
    }
    .workout-exercise-list h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--muted, #7a7a9a);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .exercise-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .exercise-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: var(--card2, #1c1c28);
      border-radius: 12px;
      gap: 12px;
    }
    .exercise-item.active {
      background: rgba(200,241,53,0.15);
      border: 1px solid var(--accent, #c8f135);
    }
    .exercise-item.completed {
      opacity: 0.5;
    }
    .exercise-item-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--surface, #111118);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }
    .exercise-item.active .exercise-item-number {
      background: var(--accent, #c8f135);
      color: #0a0a0f;
    }
    .exercise-item.completed .exercise-item-number {
      background: var(--accent4, #38d9a9);
      color: #0a0a0f;
    }
    .exercise-item-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .exercise-item-duration {
      font-size: 12px;
      color: var(--muted, #7a7a9a);
    }
    .workout-actions {
      display: flex;
      gap: 12px;
      padding: 0 24px 24px;
    }
    .btn-cancel {
      flex: 1;
      padding: 14px;
      background: var(--card2, #1c1c28);
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      border-radius: 12px;
      color: var(--text, #f0f0f8);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-cancel:hover {
      background: var(--accent3, #ff6b6b);
      border-color: var(--accent3, #ff6b6b);
    }
    .btn-skip {
      flex: 1;
      padding: 14px;
      background: var(--accent, #c8f135);
      border: none;
      border-radius: 12px;
      color: #0a0a0f;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-skip:hover {
      background: #d4ff4a;
    }
  `;
  
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateModalContent() {
  if (!currentWorkout) return;
  
  document.getElementById('workoutIcon').textContent = currentWorkout.icon;
  document.getElementById('workoutTitle').textContent = currentWorkout.title;
  document.getElementById('exerciseProgress').textContent = 
    `${currentExerciseIndex + 1}/${currentWorkout.exercises.length}`;
  
  // Update exercise list
  const exerciseList = document.getElementById('exerciseList');
  exerciseList.innerHTML = currentWorkout.exercises.map((ex, i) => {
    let duration = ex.duration ? formatTime(ex.duration) : `${ex.sets}x${ex.reps}`;
    let activeClass = i === currentExerciseIndex ? 'active' : '';
    let completedClass = i < currentExerciseIndex ? 'completed' : '';
    
    return `
      <div class="exercise-item ${activeClass} ${completedClass}">
        <div class="exercise-item-number">${i < currentExerciseIndex ? '✓' : i + 1}</div>
        <div class="exercise-item-name">${ex.name}</div>
        <div class="exercise-item-duration">${duration}</div>
      </div>
    `;
  }).join('');
  
  // Scroll to active exercise
  const activeItem = exerciseList.querySelector('.exercise-item.active');
  if (activeItem) {
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function startExercise() {
  if (!currentWorkout) return;
  
  const exercise = currentWorkout.exercises[currentExerciseIndex];
  if (!exercise) {
    // No more exercises, complete workout
    completeWorkout();
    return;
  }
  
  // Set up timer
  if (exercise.duration) {
    timeRemaining = exercise.duration;
    exerciseStartTime = Date.now();
    startTimer();
  } else if (exercise.sets && exercise.reps) {
    // Strength exercise with sets/reps
    timeRemaining = 0;
    document.getElementById('exerciseName').textContent = exercise.name;
    document.getElementById('timerDisplay').textContent = `${exercise.sets} sets × ${exercise.reps} reps`;
    document.getElementById('exerciseType').textContent = exercise.type;
    document.getElementById('pauseBtn').style.display = 'none';
  }
  
  updateModalContent();
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  document.getElementById('pauseBtn').style.display = 'flex';
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeRemaining--;
      updateTimerDisplay();
      
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        completeExercise();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timerDisplay').textContent = formatTime(timeRemaining);
  
  // Update exercise name and type
  const exercise = currentWorkout.exercises[currentExerciseIndex];
  if (exercise) {
    document.getElementById('exerciseName').textContent = exercise.name;
    document.getElementById('exerciseType').textContent = exercise.type;
  }
}

function completeExercise() {
  // Play completion sound (optional)
  playNotificationSound();
  
  // Move to next exercise
  currentExerciseIndex++;
  
  if (currentExerciseIndex >= currentWorkout.exercises.length) {
    completeWorkout();
  } else {
    startExercise();
  }
}

function skipExercise() {
  completeExercise();
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById('pauseIcon').textContent = isPaused ? '▶️' : '⏸️';
  
  const pauseBtn = document.getElementById('pauseBtn');
  pauseBtn.style.background = isPaused ? 'var(--accent3, #ff6b6b)' : 'var(--accent, #c8f135)';
}

function cancelWorkout() {
  if (confirm('Are you sure you want to cancel this workout?')) {
    hideWorkoutModal();
    currentWorkout = null;
    currentExerciseIndex = 0;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
}

function completeWorkout() {
  if (!currentWorkout) return;
  
  // Save completed workout
  const completedWorkout = {
    id: currentWorkout.id,
    title: currentWorkout.title,
    date: new Date().toISOString(),
    duration: currentWorkout.duration,
    calories: currentWorkout.calories,
    exercises: currentWorkout.exercises.length
  };
  
  // Get existing completed workouts
  const completed = JSON.parse(localStorage.getItem(WORKOUT_STORAGE.COMPLETED) || '[]');
  completed.unshift(completedWorkout);
  localStorage.setItem(WORKOUT_STORAGE.COMPLETED, JSON.stringify(completed.slice(0, 50)));
  
  // Update stats
  updateWorkoutStats(completedWorkout);
  
  // Save to Supabase (async, doesn't block UI)
  saveWorkoutToSupabase(currentWorkout);
  
  // Show success message
  showWorkoutComplete(completedWorkout);
  
  // Hide modal
  hideWorkoutModal();
  currentWorkout = null;
}

function showWorkoutComplete(workout) {
  // Create success modal
  const successHTML = `
    <div id="workoutSuccess" class="workout-modal active">
      <div class="workout-modal-content" style="text-align: center; padding: 40px;">
        <div class="success-icon" style="font-size: 64px; margin-bottom: 20px;">🎉</div>
        <h2 style="font-family: 'Syne', sans-serif; font-size: 28px; margin-bottom: 12px;">Workout Complete!</h2>
        <p style="color: var(--muted, #7a7a9a); margin-bottom: 24px;">You crushed ${workout.title}!</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
          <div style="background: var(--card2, #1c1c28); padding: 16px; border-radius: 12px;">
            <div style="font-size: 24px; font-weight: 700; color: var(--accent, #c8f135);">${workout.duration}</div>
            <div style="font-size: 11px; color: var(--muted, #7a7a9a);">MINUTES</div>
          </div>
          <div style="background: var(--card2, #1c1c28); padding: 16px; border-radius: 12px;">
            <div style="font-size: 24px; font-weight: 700; color: var(--accent3, #ff6b6b);">${workout.calories}</div>
            <div style="font-size: 11px; color: var(--muted, #7a7a9a);">CALORIES</div>
          </div>
          <div style="background: var(--card2, #1c1c28); padding: 16px; border-radius: 12px;">
            <div style="font-size: 24px; font-weight: 700; color: var(--accent4, #38d9a9);">${workout.exercises}</div>
            <div style="font-size: 11px; color: var(--muted, #7a7a9a);">EXERCISES</div>
          </div>
        </div>
        
        <button onclick="closeSuccessModal()" class="btn" style="background: var(--accent, #c8f135); color: #0a0a0f; padding: 14px 32px; width: 100%;">
          Continue
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', successHTML);
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  const modal = document.getElementById('workoutSuccess');
  if (modal) {
    modal.remove();
  }
  document.body.style.overflow = '';
  
  // Reload to update stats
  loadWorkoutStats();
}

// ==================== STATS FUNCTIONS ====================

function getWorkoutStats() {
  const defaultStats = {
    totalWorkouts: 47,
    totalMinutes: 1842,
    totalCalories: 12400,
    currentStreak: 12
  };
  
  const stored = localStorage.getItem(WORKOUT_STORAGE.STATS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultStats;
    }
  }
  return defaultStats;
}

function updateWorkoutStats(workout) {
  const stats = getWorkoutStats();
  
  stats.totalWorkouts++;
  stats.totalMinutes += workout.duration;
  stats.totalCalories += workout.calories;
  
  // Update streak
  const today = new Date().toDateString();
  const lastWorkout = localStorage.getItem('nutrimind_last_workout_date');
  if (lastWorkout !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastWorkout === yesterday.toDateString()) {
      stats.currentStreak++;
    } else if (lastWorkout !== today) {
      stats.currentStreak = 1;
    }
    localStorage.setItem('nutrimind_last_workout_date', today);
  }
  
  localStorage.setItem(WORKOUT_STORAGE.STATS, JSON.stringify(stats));
}

function loadWorkoutStats() {
  const stats = getWorkoutStats();
  
  // Update stat cards if they exist
  const totalWorkoutsEl = document.querySelector('.stat-card .stat-value');
  if (totalWorkoutsEl) {
    // Try to find the total workouts card
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      const label = card.querySelector('.stat-label');
      if (label && label.textContent === 'Total Workouts') {
        const value = card.querySelector('.stat-value');
        if (value) value.textContent = stats.totalWorkouts;
      }
    });
  }
}

// ==================== UTILITY FUNCTIONS ====================

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function saveCurrentWorkout() {
  if (currentWorkout) {
    const data = {
      workout: currentWorkout,
      exerciseIndex: currentExerciseIndex,
      startTime: Date.now()
    };
    localStorage.setItem(WORKOUT_STORAGE.CURRENT, JSON.stringify(data));
  }
}

function playNotificationSound() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 100);
  } catch (e) {
    // Audio not supported
  }
}

// Export to window
window.WorkoutManager = {
  startWorkout,
  cancelWorkout,
  togglePause,
  skipExercise,
  getWorkoutStats,
  closeSuccessModal
};

