  // User Profile Manager - NutriMind App
// Uses Supabase for authentication with localStorage fallback
// Also handles user data sync across devices

const DEFAULT_NAME = 'User';
const DEFAULT_INITIALS = 'US';
const DEFAULT_EMAIL = '';
const DEFAULT_PLAN = 'Free Plan';

// Storage keys (for localStorage fallback and caching)
const STORAGE_KEYS = {
  NAME: 'nutrimind_user_name',
  INITIALS: 'nutrimind_user_initials',
  EMAIL: 'nutrimind_user_email',
  PLAN: 'nutrimind_user_plan',
  IS_LOGGED_IN: 'nutrimind_is_logged_in',
  REMEMBER_ME: 'nutrimind_remember_me',
  SUPABASE_USER_ID: 'nutrimind_supabase_user_id',
  // Notification Settings
  PUSH_NOTIFICATIONS: 'nutrimind_push_notifications',
  EMAIL_UPDATES: 'nutrimind_email_updates',
  WORKOUT_REMINDERS: 'nutrimind_workout_reminders',
  NUTRITION_TIPS: 'nutrimind_nutrition_tips',
  MARKETING_COMM: 'nutrimind_marketing_comm',
  // Privacy Settings
  SHARE_ANONYMOUS_DATA: 'nutrimind_share_anonymous_data',
  // Unit Settings
  DISTANCE_UNIT: 'nutrimind_distance_unit',
  WEIGHT_UNIT: 'nutrimind_weight_unit',
  HEIGHT_UNIT: 'nutrimind_height_unit',
  WATER_UNIT: 'nutrimind_water_unit',
  TEMPERATURE_UNIT: 'nutrimind_temperature_unit',
  // Appearance
  THEME: 'nutrimind_theme',
  // Profile
  PHONE: 'nutrimind_user_phone',
  DOB: 'nutrimind_user_dob',
  GENDER: 'nutrimind_user_gender',
  HEIGHT: 'nutrimind_user_height',
  WEIGHT: 'nutrimind_user_weight',
  ACTIVITY_LEVEL: 'nutrimind_activity_level',
  // Profile picture storage key
  PROFILE_PICTURE: 'nutrimind_user_profile_picture'
};

// Flag to track if Supabase is available
let supabaseAvailable = false;

// Check if Supabase is loaded
function checkSupabase() {
  console.log('Checking Supabase...');
  console.log('window.supabase exists:', !!window.supabase);
  console.log('window.SupabaseAuth exists:', !!window.SupabaseAuth);
  
  // First check if our library loader has loaded
  if (window.SupabaseLibLoaded) {
    console.log('Supabase library loader completed');
  }
  
  // Check if SupabaseAuth is available (from supabase.js)
  if (window.SupabaseAuth) {
    supabaseAvailable = true;
    console.log('Supabase is available!');
    return true;
  }
  
  // Check if window.supabase exists (fallback mode)
  if (window.supabase) {
    supabaseAvailable = true;
    console.log('Supabase (fallback mode) is available!');
    return true;
  }
  
  console.log('Supabase not available, using localStorage fallback');
  return false;
}

// Wait for Supabase to load (with retry) - Updated to work with supabase-lib.js
async function waitForSupabase(maxAttempts = 20, delay = 300) {
  for (let i = 0; i < maxAttempts; i++) {
    // Check for SupabaseAuth (from supabase.js)
    if (window.SupabaseAuth) {
      supabaseAvailable = true;
      console.log('Supabase loaded after', i + 1, 'attempts');
      return true;
    }
    
    // Check for fallback supabase client
    if (window.supabase && window.SupabaseLibLoaded) {
      supabaseAvailable = true;
      console.log('Supabase (fallback) loaded after', i + 1, 'attempts');
      return true;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.log('Supabase failed to load after', maxAttempts, 'attempts - using localStorage fallback');
  return false;
}

// Initialize Supabase listener for auth state changes
async function initSupabaseAuth() {
  console.log('Initializing Supabase Auth...');
  
  // Wait for Supabase to be available (it loads asynchronously)
  let attempts = 0;
  const maxAttempts = 20;
  
  while (!window.SupabaseAuth && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 250));
    attempts++;
  }
  
  if (!window.SupabaseAuth) {
    console.log('Supabase not available after waiting, using localStorage fallback');
    return;
  }
  
  supabaseAvailable = true;
  console.log('Supabase is available!');

  // Listen for auth state changes
  window.SupabaseAuth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event);
    
    if (event === 'SIGNED_IN' && session) {
      // User signed in - sync data
      await syncUserData(session.user);
      updateUserDisplay();
    } else if (event === 'SIGNED_OUT') {
      // User signed out - clear local data
      clearLocalUserData();
      updateUserDisplay();
    }
  });

  // Check current session on load
  checkCurrentSession();
}

// Check for existing session
async function checkCurrentSession() {
  if (!supabaseAvailable) return;

  const { success, session } = await SupabaseAuth.getSession();
  if (success && session) {
    await syncUserData(session.user);
    updateUserDisplay();
  }
}

// Sync user data from Supabase to localStorage
async function syncUserData(user) {
  if (!user) return;

  // Store Supabase user ID
  localStorage.setItem(STORAGE_KEYS.SUPABASE_USER_ID, user.id);
  localStorage.setItem(STORAGE_KEYS.EMAIL, user.email);
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

  // Try to get additional user data from our database
  const { success, data } = await SupabaseDB.getUserData(user.id);
  
  if (success && data) {
    // Sync from database
    if (data.full_name) {
      localStorage.setItem(STORAGE_KEYS.NAME, data.full_name);
      localStorage.setItem(STORAGE_KEYS.INITIALS, generateInitials(data.full_name));
    }
    if (data.plan) {
      localStorage.setItem(STORAGE_KEYS.PLAN, data.plan);
    }
  } else {
    // Fall back to user metadata
    if (user.user_metadata?.full_name) {
      localStorage.setItem(STORAGE_KEYS.NAME, user.user_metadata.full_name);
      localStorage.setItem(STORAGE_KEYS.INITIALS, generateInitials(user.user_metadata.full_name));
    }
  }

  // Also sync settings and profile from Supabase
  await syncUserSettings(user.id);
  await syncUserProfile(user.id);
}

// Sync user settings from Supabase
async function syncUserSettings(userId) {
  if (!supabaseAvailable) return;

  const { success, data } = await SupabaseDB.getUserSettings(userId);
  if (success && data) {
    // Sync settings to localStorage
    if (data.push_notifications !== undefined) {
      localStorage.setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS, data.push_notifications);
    }
    if (data.email_updates !== undefined) {
      localStorage.setItem(STORAGE_KEYS.EMAIL_UPDATES, data.email_updates);
    }
    if (data.workout_reminders !== undefined) {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_REMINDERS, data.workout_reminders);
    }
    if (data.nutrition_tips !== undefined) {
      localStorage.setItem(STORAGE_KEYS.NUTRITION_TIPS, data.nutrition_tips);
    }
    if (data.marketing_comm !== undefined) {
      localStorage.setItem(STORAGE_KEYS.MARKETING_COMM, data.marketing_comm);
    }
    if (data.distance_unit) {
      localStorage.setItem(STORAGE_KEYS.DISTANCE_UNIT, data.distance_unit);
    }
    if (data.weight_unit) {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_UNIT, data.weight_unit);
    }
    if (data.height_unit) {
      localStorage.setItem(STORAGE_KEYS.HEIGHT_UNIT, data.height_unit);
    }
    if (data.water_unit) {
      localStorage.setItem(STORAGE_KEYS.WATER_UNIT, data.water_unit);
    }
    if (data.temperature_unit) {
      localStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, data.temperature_unit);
    }
    if (data.theme) {
      localStorage.setItem(STORAGE_KEYS.THEME, data.theme);
    }
    if (data.share_anonymous_data !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SHARE_ANONYMOUS_DATA, data.share_anonymous_data);
    }
  }
}

// Sync user profile from Supabase
async function syncUserProfile(userId) {
  if (!supabaseAvailable) return;

  const { success, data } = await SupabaseDB.getUserProfile(userId);
  if (success && data) {
    if (data.phone) localStorage.setItem(STORAGE_KEYS.PHONE, data.phone);
    if (data.dob) localStorage.setItem(STORAGE_KEYS.DOB, data.dob);
    if (data.gender) localStorage.setItem(STORAGE_KEYS.GENDER, data.gender);
    if (data.height) localStorage.setItem(STORAGE_KEYS.HEIGHT, data.height);
    if (data.weight) localStorage.setItem(STORAGE_KEYS.WEIGHT, data.weight);
    if (data.activity_level) localStorage.setItem(STORAGE_KEYS.ACTIVITY_LEVEL, data.activity_level);
  }
}

// Clear local user data on logout
function clearLocalUserData() {
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_USER_ID);
  sessionStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
}

/**
 * Generate initials from a name
 * @param {string} name - The full name
 * @returns {string} - Two-letter initials
 */
function generateInitials(name) {
  if (!name || typeof name !== 'string') return DEFAULT_INITIALS;
  
  const trimmed = name.trim();
  if (trimmed.length === 0) return DEFAULT_INITIALS;
  
  // Split by space and take first letters
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return trimmed.substring(0, 2).toUpperCase();
}

/**
 * Save user name to localStorage
 * @param {string} name - The user's name
 */
function saveUserName(name) {
  if (!name || typeof name !== 'string') return;
  
  const trimmedName = name.trim();
  if (trimmedName.length === 0) return;
  
  const initials = generateInitials(trimmedName);
  
  localStorage.setItem(STORAGE_KEYS.NAME, trimmedName);
  localStorage.setItem(STORAGE_KEYS.INITIALS, initials);
  
  // Update the current page immediately
  updateUserDisplay();
}

/**
 * Get user name from localStorage
 * @returns {string} - The user's name or default
 */
function getUserName() {
  return localStorage.getItem(STORAGE_KEYS.NAME) || DEFAULT_NAME;
}

/**
 * Get user initials from localStorage
 * @returns {string} - The user's initials or default
 */
function getUserInitials() {
  return localStorage.getItem(STORAGE_KEYS.INITIALS) || DEFAULT_INITIALS;
}

/**
 * Get user email from localStorage
 * @returns {string} - The user's email or default
 */
function getUserEmail() {
  return localStorage.getItem(STORAGE_KEYS.EMAIL) || DEFAULT_EMAIL;
}

/**
 * Get user plan from localStorage
 * @returns {string} - The user's plan or default
 */
function getUserPlan() {
  return localStorage.getItem(STORAGE_KEYS.PLAN) || DEFAULT_PLAN;
}

/**
 * Update all user display elements on the page
 * Updates: .avatar, .user-name, .profile-avatar, .user-email, .user-plan
 */
function updateUserDisplay() {
  const name = getUserName();
  const initials = getUserInitials();
  const email = getUserEmail();
  const plan = getUserPlan();
  const profilePicture = getProfilePicture();
  
  // Update sidebar avatar (2-letter initials) - check for profile picture first
  const avatarElements = document.querySelectorAll('.avatar');
  avatarElements.forEach(el => {
    if (profilePicture) {
      el.style.backgroundImage = `url(${profilePicture})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    } else {
      el.style.backgroundImage = '';
      el.textContent = initials;
    }
  });
  
  // Update sidebar user name
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(el => {
    el.textContent = name;
  });
  
  // Update profile avatar in settings page - check for profile picture first
  const profileAvatarElements = document.querySelectorAll('.profile-avatar');
  profileAvatarElements.forEach(el => {
    if (profilePicture) {
      el.style.backgroundImage = `url(${profilePicture})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    } else {
      el.style.backgroundImage = '';
      el.textContent = initials;
    }
  });
  
  // Update email display if exists
  const userEmailElements = document.querySelectorAll('.user-email');
  userEmailElements.forEach(el => {
    el.textContent = email;
  });
  
  // Update plan display if exists
  const userPlanElements = document.querySelectorAll('.user-plan');
  userPlanElements.forEach(el => {
    el.textContent = plan;
  });
  
  // Update settings input if exists
  const nameInput = document.querySelector('.settings-content .settings-input[type="text"]');
  if (nameInput && nameInput.value !== name) {
    nameInput.value = name;
  }
}

/**
 * Check if user is logged in
 * @returns {boolean} - True if user is logged in
 */
function isLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
}

/**
 * Check if remember me is enabled
 * @returns {boolean} - True if remember me is enabled
 */
function isRememberMeEnabled() {
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
}

/**
 * Authenticate user with email and password using Supabase
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} rememberMe - Whether to remember the user
 * @returns {object} - Result with success status and message
 */
async function login(email, password, rememberMe = false) {
  // Try Supabase authentication first
  if (supabaseAvailable) {
    try {
      const result = await SupabaseAuth.signIn(email, password);
      
      if (result.success) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe ? 'true' : 'false');
        
        // If not remembered, set session storage for session-only login
        if (!rememberMe) {
          sessionStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        }
        
        // Sync user data from Supabase
        await syncUserData(result.data.user);
        
        // Log successful login to Supabase
        await SupabaseDB.logLoginAttempt(result.data.user.id, email, true, null, null);
        
        return { success: true, message: 'Login successful!' };
      } else {
        // Log failed login attempt
        await SupabaseDB.logLoginAttempt(null, email, false, null, result.message);
        
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Supabase login error:', error);
      
      // Log failed login attempt
      await SupabaseDB.logLoginAttempt(null, email, false, null, error.message || 'Login failed');
      
      return { success: false, message: error.message || 'Login failed' };
    }
  }
  
  // Fallback to demo/local authentication if Supabase not available
  if (email && password) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.EMAIL, email);
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe ? 'true' : 'false');
    
    // Extract name from email for display
    const nameFromEmail = email.split('@')[0];
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1).replace(/[._-]/g, ' ');
    saveUserName(formattedName);
    
    if (!rememberMe) {
      sessionStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    }
    
    // Log successful login (local fallback)
    await SupabaseDB.logLoginAttempt(null, email, true, null, 'Local fallback');
    
    return { success: true, message: 'Login successful!' };
  }
  
  // Log failed login attempt (local fallback)
  await SupabaseDB.logLoginAttempt(null, email || '', false, null, 'Invalid email or password');
  
  return { success: false, message: 'Invalid email or password' };
}

/**
 * Log out the current user
 */
async function logout() {
  // Try Supabase sign out first
  if (supabaseAvailable) {
    try {
      await SupabaseAuth.signOut();
    } catch (error) {
      console.error('Supabase sign out error:', error);
    }
  }
  
  // Clear local data
  clearLocalUserData();
  updateUserDisplay();
  
  // Redirect to login page
  window.location.href = 'index.html';
}

/**
 * Redirect to login page if not authenticated
 */
async function requireAuth() {
  if (!isLoggedIn()) {
    // Try to check Supabase session
    if (supabaseAvailable) {
      const { success, session } = await SupabaseAuth.getSession();
      if (success && session) {
        await syncUserData(session.user);
        updateUserDisplay();
        return true;
      }
    }
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/**
 * Register a new user using Supabase
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {object} - Result with success status and message
 */
async function signup(name, email, password) {
  console.log('Starting signup process for:', email);
  
  // Try Supabase signup first
  if (supabaseAvailable && window.SupabaseAuth) {
    try {
      console.log('Attempting Supabase signup...');
      const result = await window.SupabaseAuth.signUp(email, password, {
        fullName: name
      });
      
      console.log('Supabase signup result:', result);
      
      if (result.success) {
        // Save to localStorage
        const initials = generateInitials(name);
        localStorage.setItem(STORAGE_KEYS.NAME, name);
        localStorage.setItem(STORAGE_KEYS.INITIALS, initials);
        localStorage.setItem(STORAGE_KEYS.EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.PLAN, 'Free Plan');
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        
        // Create user record in database
        if (result.data && result.data.user) {
          console.log('Creating user record for:', result.data.user.id);
          const upsertResult = await window.SupabaseDB.upsertUser(result.data.user.id, {
            email: email,
            full_name: name,
            plan: 'Free Plan'
          });
          console.log('Upsert result:', upsertResult);
        }
        
        // If email confirmation is required
        if (result.data && result.data.session === null) {
          return { 
            success: true, 
            message: 'Account created! Please check your email to confirm your account.',
            needsEmailConfirmation: true 
          };
        }
        
        return { success: true, message: 'Account created successfully!' };
      } else {
        console.error('Signup failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Supabase signup error:', error);
      return { success: false, message: error.message || 'Signup failed' };
    }
  }
  
  // Fallback to local signup if Supabase not available
  console.log('Supabase not available, using local fallback');
  // Check if email already exists
  const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
  if (storedEmail && storedEmail.toLowerCase() === email.toLowerCase()) {
    return { success: false, message: 'An account with this email already exists' };
  }
  
  // Validate inputs
  if (!name || !email || !password) {
    return { success: false, message: 'Please fill in all fields' };
  }
  
  if (password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters' };
  }
  
  // Save user data
  const initials = generateInitials(name);
  localStorage.setItem(STORAGE_KEYS.NAME, name);
  localStorage.setItem(STORAGE_KEYS.INITIALS, initials);
  localStorage.setItem(STORAGE_KEYS.EMAIL, email);
  localStorage.setItem(STORAGE_KEYS.PLAN, 'Free Plan');
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  
  return { success: true, message: 'Account created successfully!' };
}

/**
 * Initialize user profile on page load
 */
function initUserProfile() {
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUserDisplay);
  } else {
    updateUserDisplay();
  }
}

// Auto-initialize when script loads
initUserProfile();

// ==================== SETTINGS FUNCTIONS ====================

// Notification Settings
function getNotificationSettings() {
  return {
    pushNotifications: localStorage.getItem(STORAGE_KEYS.PUSH_NOTIFICATIONS) !== 'false',
    emailUpdates: localStorage.getItem(STORAGE_KEYS.EMAIL_UPDATES) !== 'false',
    workoutReminders: localStorage.getItem(STORAGE_KEYS.WORKOUT_REMINDERS) !== 'false',
    nutritionTips: localStorage.getItem(STORAGE_KEYS.NUTRITION_TIPS) === 'true',
    marketingComm: localStorage.getItem(STORAGE_KEYS.MARKETING_COMM) === 'true'
  };
}

function saveNotificationSettings(settings) {
  if (settings.pushNotifications !== undefined) {
    localStorage.setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS, settings.pushNotifications);
  }
  if (settings.emailUpdates !== undefined) {
    localStorage.setItem(STORAGE_KEYS.EMAIL_UPDATES, settings.emailUpdates);
  }
  if (settings.workoutReminders !== undefined) {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_REMINDERS, settings.workoutReminders);
  }
  if (settings.nutritionTips !== undefined) {
    localStorage.setItem(STORAGE_KEYS.NUTRITION_TIPS, settings.nutritionTips);
  }
  if (settings.marketingComm !== undefined) {
    localStorage.setItem(STORAGE_KEYS.MARKETING_COMM, settings.marketingComm);
  }
}

// Privacy Settings
function getPrivacySettings() {
  return {
    shareAnonymousData: localStorage.getItem(STORAGE_KEYS.SHARE_ANONYMOUS_DATA) !== 'false'
  };
}

function savePrivacySettings(settings) {
  if (settings.shareAnonymousData !== undefined) {
    localStorage.setItem(STORAGE_KEYS.SHARE_ANONYMOUS_DATA, settings.shareAnonymousData);
  }
}

// Unit Settings
function getUnitSettings() {
  return {
    distanceUnit: localStorage.getItem(STORAGE_KEYS.DISTANCE_UNIT) || 'km',
    weightUnit: localStorage.getItem(STORAGE_KEYS.WEIGHT_UNIT) || 'kg',
    heightUnit: localStorage.getItem(STORAGE_KEYS.HEIGHT_UNIT) || 'cm',
    waterUnit: localStorage.getItem(STORAGE_KEYS.WATER_UNIT) || 'L',
    temperatureUnit: localStorage.getItem(STORAGE_KEYS.TEMPERATURE_UNIT) || 'C'
  };
}

function saveUnitSettings(settings) {
  if (settings.distanceUnit) localStorage.setItem(STORAGE_KEYS.DISTANCE_UNIT, settings.distanceUnit);
  if (settings.weightUnit) localStorage.setItem(STORAGE_KEYS.WEIGHT_UNIT, settings.weightUnit);
  if (settings.heightUnit) localStorage.setItem(STORAGE_KEYS.HEIGHT_UNIT, settings.heightUnit);
  if (settings.waterUnit) localStorage.setItem(STORAGE_KEYS.WATER_UNIT, settings.waterUnit);
  if (settings.temperatureUnit) localStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, settings.temperatureUnit);
}

// Appearance Settings
function getAppearanceSettings() {
  return {
    theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark'
  };
}

function saveAppearanceSettings(settings) {
  if (settings.theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, settings.theme);
    applyTheme(settings.theme);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Profile Settings
function getProfileSettings() {
  return {
    name: getUserName(),
    email: getUserEmail(),
    phone: localStorage.getItem(STORAGE_KEYS.PHONE) || '',
    dob: localStorage.getItem(STORAGE_KEYS.DOB) || '',
    gender: localStorage.getItem(STORAGE_KEYS.GENDER) || '',
    height: localStorage.getItem(STORAGE_KEYS.HEIGHT) || '',
    weight: localStorage.getItem(STORAGE_KEYS.WEIGHT) || '',
    activityLevel: localStorage.getItem(STORAGE_KEYS.ACTIVITY_LEVEL) || ''
  };
}

function saveProfileSettings(settings) {
  if (settings.name) saveUserName(settings.name);
  if (settings.email) localStorage.setItem(STORAGE_KEYS.EMAIL, settings.email);
  if (settings.phone !== undefined) localStorage.setItem(STORAGE_KEYS.PHONE, settings.phone);
  if (settings.dob !== undefined) localStorage.setItem(STORAGE_KEYS.DOB, settings.dob);
  if (settings.gender !== undefined) localStorage.setItem(STORAGE_KEYS.GENDER, settings.gender);
  if (settings.height !== undefined) localStorage.setItem(STORAGE_KEYS.HEIGHT, settings.height);
  if (settings.weight !== undefined) localStorage.setItem(STORAGE_KEYS.WEIGHT, settings.weight);
  if (settings.activityLevel !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVITY_LEVEL, settings.activityLevel);
}

// Profile Picture Functions
function getProfilePicture() {
  return localStorage.getItem(STORAGE_KEYS.PROFILE_PICTURE);
}

function saveProfilePicture(dataUrl) {
  localStorage.setItem(STORAGE_KEYS.PROFILE_PICTURE, dataUrl);
  updateUserDisplay();
}

function removeProfilePicture() {
  localStorage.removeItem(STORAGE_KEYS.PROFILE_PICTURE);
  updateUserDisplay();
}

function hasProfilePicture() {
  return !!localStorage.getItem(STORAGE_KEYS.PROFILE_PICTURE);
}

// Export functions for use in other scripts
window.UserProfile = {
  // Auth functions
  login,
  logout,
  requireAuth,
  signup,
  // User info
  saveUserName,
  getUserName,
  getUserInitials,
  getUserEmail,
  getUserPlan,
  updateUserDisplay,
  isLoggedIn,
  isRememberMeEnabled,
  // Settings
  getNotificationSettings,
  saveNotificationSettings,
  getPrivacySettings,
  savePrivacySettings,
  getUnitSettings,
  saveUnitSettings,
  getAppearanceSettings,
  saveAppearanceSettings,
  getProfileSettings,
  saveProfileSettings,
  // Profile Picture
  getProfilePicture,
  saveProfilePicture,
  removeProfilePicture,
  hasProfilePicture,
  // Supabase initialization
  initSupabaseAuth
};

// Auto-initialize Supabase auth when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initSupabaseAuth();
});

