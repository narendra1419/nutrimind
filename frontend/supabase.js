// Supabase Client Configuration
// ================================
// Initialize Supabase client for NutriMind app

const SUPABASE_URL = 'https://oqjsmldkvsbkpuxxjrtj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xanNtbGRrdnNia3B1eHhqcnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjU5NjAsImV4cCI6MjA4ODYwMTk2MH0.KYZBFkzjdn3W1MB_oV2ll3NcMFLhfOU1u5xst-05ozI';

// Create Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.SupabaseClient = supabase;
window.supabaseClient = supabase;

// Database table names
const TABLES = {
  USERS: 'users',
  USER_SETTINGS: 'user_settings',
  USER_PROFILE: 'user_profile',
  WORKOUTS: 'workouts',
  NUTRITION_LOGS: 'nutrition_logs',
  HYDRATION_LOGS: 'hydration_logs',
  SLEEP_RECORDS: 'sleep_records',
  VITALS_RECORDS: 'vitals_records',
  GOALS: 'goals',
  LOGIN_LOGS: 'login_logs'
};

/**
 * Supabase Authentication Helpers
 */
const SupabaseAuth = {
  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;
      return { success: true, data, message: 'Login successful!' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, message: error.message || 'Failed to sign in' };
    }
  },

  /**
   * Sign up with email and password
   */
  async signUp(email, password, options = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: options.fullName || '',
            ...options.metadata
          }
        }
      });

      if (error) throw error;
      return { success: true, data, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: error.message || 'Failed to sign up' };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true, message: 'Signed out successfully!' };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, message: error.message || 'Failed to sign out' };
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session: data.session };
    } catch (error) {
      console.error('Get session error:', error);
      return { success: false, session: null };
    }
  },

  /**
   * Get current user
   */
  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, user: null };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * Reset password (send reset email)
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/frontend/reset-password.html`
      });

      if (error) throw error;
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: error.message || 'Failed to send reset email' };
    }
  },

  /**
   * Update user metadata
   */
  async updateUserMetadata(metadata) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: error.message || 'Failed to update user' };
    }
  }
};

/**
 * Supabase Database Helpers
 */
const SupabaseDB = {
  /**
   * Get user data from custom users table
   */
  async getUserData(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get user data error:', error);
      return { success: false, data: null, message: error.message };
    }
  },

  /**
   * Create or update user record
   */
  async upsertUser(userId, userData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .upsert({
          id: userId,
          ...userData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Upsert user error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Get user settings
   */
  async getUserSettings(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_SETTINGS)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get settings error:', error);
      return { success: false, data: null };
    }
  },

  /**
   * Save user settings
   */
  async saveUserSettings(userId, settings) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_SETTINGS)
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save settings error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_PROFILE)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, data: null };
    }
  },

/**
   * Save user profile
   */
  async saveUserProfile(userId, profile) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_PROFILE)
        .upsert({
          user_id: userId,
          ...profile,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save profile error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Log a login attempt to the database
   * @param {string} userId - The user's ID (null if failed login)
   * @param {string} email - The email used for login
   * @param {boolean} success - Whether the login was successful
   * @param {string} ipAddress - The IP address of the user
   * @param {string} errorMessage - Error message if login failed
   */
  async logLoginAttempt(userId, email, success, ipAddress = null, errorMessage = null) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LOGIN_LOGS)
        .insert({
          user_id: userId,
          email: email,
          success: success,
          ip_address: ipAddress,
          error_message: errorMessage,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Log login attempt error:', error);
      // Don't return failure - logging should not break the login flow
      return { success: false, message: error.message };
    }
  },

  // ==================== WORKOUTS ====================

  /**
   * Get all workouts for a user
   */
  async getWorkouts(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WORKOUTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get workouts error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Get workouts for a specific date
   */
  async getWorkoutsByDate(userId, date) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WORKOUTS)
        .select('*')
        .eq('user_id', userId)
        .eq('created_at', date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get workouts by date error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Save a workout
   */
  async saveWorkout(userId, workout) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WORKOUTS)
        .insert({
          user_id: userId,
          workout_type: workout.workoutType || workout.workout_type,
          title: workout.title,
          duration: workout.duration,
          calories: workout.calories || 0,
          distance: workout.distance || null,
          heart_rate_avg: workout.heartRateAvg || null,
          heart_rate_max: workout.heartRateMax || null,
          completed: workout.completed || false,
          completed_at: workout.completedAt || workout.completed_at || null,
          notes: workout.notes || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save workout error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Update a workout
   */
  async updateWorkout(workoutId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WORKOUTS)
        .update(updates)
        .eq('id', workoutId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Update workout error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete a workout
   */
  async deleteWorkout(workoutId) {
    try {
      const { error } = await supabase
        .from(TABLES.WORKOUTS)
        .delete()
        .eq('id', workoutId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete workout error:', error);
      return { success: false, message: error.message };
    }
  },

  // ==================== NUTRITION LOGS ====================

  /**
   * Get all nutrition logs for a user
   */
  async getNutritionLogs(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NUTRITION_LOGS)
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get nutrition logs error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Get nutrition logs for a specific date
   */
  async getNutritionLogsByDate(userId, date) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NUTRITION_LOGS)
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', `${date}T00:00:00`)
        .lte('logged_at', `${date}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get nutrition logs by date error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Save a nutrition log
   */
  async saveNutritionLog(userId, nutrition) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NUTRITION_LOGS)
        .insert({
          user_id: userId,
          meal_type: nutrition.mealType || nutrition.meal_type,
          food_name: nutrition.foodName || nutrition.food_name,
          calories: nutrition.calories || 0,
          protein: nutrition.protein || 0,
          carbohydrates: nutrition.carbohydrates || 0,
          fat: nutrition.fat || 0,
          fiber: nutrition.fiber || 0,
          sugar: nutrition.sugar || 0,
          sodium: nutrition.sodium || 0,
          serving_size: nutrition.servingSize || nutrition.serving_size,
          quantity: nutrition.quantity || 1,
          logged_at: nutrition.loggedAt || nutrition.logged_at || new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save nutrition log error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete a nutrition log
   */
  async deleteNutritionLog(logId) {
    try {
      const { error } = await supabase
        .from(TABLES.NUTRITION_LOGS)
        .delete()
        .eq('id', logId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete nutrition log error:', error);
      return { success: false, message: error.message };
    }
  },

  // ==================== HYDRATION LOGS ====================

  /**
   * Get all hydration logs for a user
   */
  async getHydrationLogs(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.HYDRATION_LOGS)
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get hydration logs error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Get hydration logs for today
   */
  async getTodayHydration(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from(TABLES.HYDRATION_LOGS)
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get today hydration error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Save a hydration log
   */
  async saveHydrationLog(userId, hydration) {
    try {
      const { data, error } = await supabase
        .from(TABLES.HYDRATION_LOGS)
        .insert({
          user_id: userId,
          amount_ml: hydration.amountMl || hydration.amount_ml,
          drink_type: hydration.drinkType || hydration.drink_type || 'water',
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save hydration log error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete a hydration log
   */
  async deleteHydrationLog(logId) {
    try {
      const { error } = await supabase
        .from(TABLES.HYDRATION_LOGS)
        .delete()
        .eq('id', logId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete hydration log error:', error);
      return { success: false, message: error.message };
    }
  },

  // ==================== SLEEP RECORDS ====================

  /**
   * Get all sleep records for a user
   */
  async getSleepRecords(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SLEEP_RECORDS)
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get sleep records error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Get sleep records for a date range
   */
  async getSleepRecordsByDateRange(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SLEEP_RECORDS)
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', startDate)
        .lte('logged_at', endDate)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get sleep records by date range error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Save a sleep record
   */
  async saveSleepRecord(userId, sleep) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SLEEP_RECORDS)
        .insert({
          user_id: userId,
          bedtime: sleep.bedtime,
          wake_time: sleep.wakeTime || sleep.wake_time,
          duration_minutes: sleep.durationMinutes || sleep.duration_minutes,
          quality: sleep.quality || null,
          deep_sleep_minutes: sleep.deepSleepMinutes || sleep.deep_sleep_minutes || null,
          light_sleep_minutes: sleep.lightSleepMinutes || sleep.light_sleep_minutes || null,
          rem_sleep_minutes: sleep.remSleepMinutes || sleep.rem_sleep_minutes || null,
          awake_minutes: sleep.awakeMinutes || sleep.awake_minutes || 0,
          times_awake: sleep.timesAwake || sleep.times_awake || 0,
          notes: sleep.notes || null,
          logged_at: sleep.loggedAt || sleep.logged_at || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save sleep record error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete a sleep record
   */
  async deleteSleepRecord(recordId) {
    try {
      const { error } = await supabase
        .from(TABLES.SLEEP_RECORDS)
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete sleep record error:', error);
      return { success: false, message: error.message };
    }
  },

  // ==================== VITALS RECORDS ====================

  /**
   * Get all vitals records for a user
   */
  async getVitalsRecords(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.VITALS_RECORDS)
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get vitals records error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Get the latest vitals record
   */
  async getLatestVitals(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.VITALS_RECORDS)
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get latest vitals error:', error);
      return { success: false, data: null, message: error.message };
    }
  },

  /**
   * Save a vitals record
   */
  async saveVitalsRecord(userId, vitals) {
    try {
      const { data, error } = await supabase
        .from(TABLES.VITALS_RECORDS)
        .insert({
          user_id: userId,
          blood_pressure_systolic: vitals.bloodPressureSystolic || vitals.blood_pressure_systolic || null,
          blood_pressure_diastolic: vitals.bloodPressureDiastolic || vitals.blood_pressure_diastolic || null,
          heart_rate: vitals.heartRate || vitals.heart_rate || null,
          temperature: vitals.temperature || null,
          oxygen_saturation: vitals.oxygenSaturation || vitals.oxygen_saturation || null,
          respiratory_rate: vitals.respiratoryRate || vitals.respiratory_rate || null,
          weight: vitals.weight || null,
          height: vitals.height || null,
          bmi: vitals.bmi || null,
          recorded_at: vitals.recordedAt || vitals.recorded_at || new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save vitals record error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete a vitals record
   */
  async deleteVitalsRecord(recordId) {
    try {
      const { error } = await supabase
        .from(TABLES.VITALS_RECORDS)
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete vitals record error:', error);
      return { success: false, message: error.message };
    }
  },

  // ==================== GOALS ====================

  /**
   * Get all goals for a user
   */
  async getGoals(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GOALS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get goals error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Get active goals for a user
   */
  async getActiveGoals(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GOALS)
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get active goals error:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  /**
   * Save a goal
   */
  async saveGoal(userId, goal) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GOALS)
        .insert({
          user_id: userId,
          goal_type: goal.goalType || goal.goal_type,
          title: goal.title,
          target_value: goal.targetValue || goal.target_value,
          current_value: goal.currentValue || goal.current_value || 0,
          unit: goal.unit || null,
          deadline: goal.deadline || null,
          status: goal.status || 'active',
          notes: goal.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save goal error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Update a goal
   */
  async updateGoal(goalId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GOALS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Update goal error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete a goal
   */
  async deleteGoal(goalId) {
    try {
      const { error } = await supabase
        .from(TABLES.GOALS)
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete goal error:', error);
      return { success: false, message: error.message };
    }
  }
};

// Export to global scope
window.SupabaseAuth = SupabaseAuth;
window.SupabaseDB = SupabaseDB;
window.TABLES = TABLES;

