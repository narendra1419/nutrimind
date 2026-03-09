// NutriMind API Client - C# Backend
// ================================
// Connect to ASP.NET Core API backend

const API_BASE_URL = 'http://localhost:5001';

// Storage for JWT token
let authToken = localStorage.getItem('nutrimind_api_token');

/**
 * API Client for NutriMind C# Backend
 */
const ApiClient = {
    /**
     * Set the authentication token
     */
    setToken(token) {
        authToken = token;
        localStorage.setItem('nutrimind_api_token', token);
    },

    /**
     * Clear the authentication token
     */
    clearToken() {
        authToken = null;
        localStorage.removeItem('nutrimind_api_token');
    },

    /**
     * Get the authentication token
     */
    getToken() {
        return authToken;
    },

    /**
     * Make an API request
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return { success: true, data, status: response.status };
        } catch (error) {
            console.error('API request error:', error);
            return { success: false, message: error.message };
        }
    },

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    /**
     * POST request
     */
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    /**
     * PUT request
     */
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

/**
 * Authentication API
 */
const ApiAuth = {
    /**
     * Register a new user
     */
    async register(email, password, fullName) {
        const result = await ApiClient.post('/api/auth/register', {
            email,
            password,
            fullName
        });

        if (result.success && result.data.token) {
            ApiClient.setToken(result.data.token);
        }

        return result;
    },

    /**
     * Login with email and password
     */
    async login(email, password) {
        const result = await ApiClient.post('/api/auth/login', {
            email,
            password
        });

        if (result.success && result.data.token) {
            ApiClient.setToken(result.data.token);
        }

        return result;
    },

    /**
     * Logout the current user
     */
    async logout() {
        const userId = localStorage.getItem('nutrimind_user_id');
        if (userId) {
            await ApiClient.post('/api/auth/logout', { userId });
        }
        ApiClient.clearToken();
    },

    /**
     * Get current user info
     */
    async getCurrentUser() {
        return ApiClient.get('/api/users/me');
    }
};

/**
 * User Settings API
 */
const ApiSettings = {
    /**
     * Get user settings
     */
    async get(userId) {
        return ApiClient.get(`/api/settings/${userId}`);
    },

    /**
     * Update user settings
     */
    async update(userId, settings) {
        return ApiClient.put(`/api/settings/${userId}`, settings);
    }
};

/**
 * User Profile API
 */
const ApiProfile = {
    /**
     * Get user profile
     */
    async get(userId) {
        return ApiClient.get(`/api/profile/${userId}`);
    },

    /**
     * Update user profile
     */
    async update(userId, profile) {
        return ApiClient.put(`/api/profile/${userId}`, profile);
    }
};

/**
 * Workouts API
 */
const ApiWorkouts = {
    /**
     * Get all workouts for user
     */
    async getAll(userId) {
        return ApiClient.get(`/api/workouts/${userId}`);
    },

    /**
     * Get a single workout
     */
    async get(workoutId) {
        return ApiClient.get(`/api/workouts/id/${workoutId}`);
    },

    /**
     * Create a workout
     */
    async create(workout) {
        return ApiClient.post('/api/workouts', workout);
    },

    /**
     * Delete a workout
     */
    async delete(workoutId) {
        return ApiClient.delete(`/api/workouts/${workoutId}`);
    }
};

/**
 * Nutrition API
 */
const ApiNutrition = {
    /**
     * Get nutrition logs for user
     */
    async getAll(userId) {
        return ApiClient.get(`/api/nutrition/${userId}`);
    },

    /**
     * Get nutrition logs for a specific date
     */
    async getByDate(userId, date) {
        return ApiClient.get(`/api/nutrition/${userId}?date=${date}`);
    },

    /**
     * Add nutrition log
     */
    async create(nutritionLog) {
        return ApiClient.post('/api/nutrition', nutritionLog);
    },

    /**
     * Delete nutrition log
     */
    async delete(logId) {
        return ApiClient.delete(`/api/nutrition/${logId}`);
    }
};

/**
 * Sleep API
 */
const ApiSleep = {
    /**
     * Get sleep records for user
     */
    async getAll(userId) {
        return ApiClient.get(`/api/sleep/${userId}`);
    },

    /**
     * Add sleep record
     */
    async create(sleepRecord) {
        return ApiClient.post('/api/sleep', sleepRecord);
    }
};

/**
 * Hydration API
 */
const ApiHydration = {
    /**
     * Get hydration logs for user
     */
    async getAll(userId) {
        return ApiClient.get(`/api/hydration/${userId}`);
    },

    /**
     * Add hydration log
     */
    async create(hydrationLog) {
        return ApiClient.post('/api/hydration', hydrationLog);
    }
};

/**
 * Vitals API
 */
const ApiVitals = {
    /**
     * Get vital records for user
     */
    async getAll(userId) {
        return ApiClient.get(`/api/vitals/${userId}`);
    },

    /**
     * Add vital record
     */
    async create(vitalRecord) {
        return ApiClient.post('/api/vitals', vitalRecord);
    }
};

/**
 * Goals API
 */
const ApiGoals = {
    /**
     * Get goals for user
     */
    async getAll(userId) {
        return ApiClient.get(`/api/goals/${userId}`);
    },

    /**
     * Create a goal
     */
    async create(goal) {
        return ApiClient.post('/api/goals', goal);
    },

    /**
     * Update a goal
     */
    async update(goalId, update) {
        return ApiClient.put(`/api/goals/${goalId}`, update);
    },

    /**
     * Delete a goal
     */
    async delete(goalId) {
        return ApiClient.delete(`/api/goals/${goalId}`);
    }
};

// Export to global scope
window.ApiClient = ApiClient;
window.ApiAuth = ApiAuth;
window.ApiSettings = ApiSettings;
window.ApiProfile = ApiProfile;
window.ApiWorkouts = ApiWorkouts;
window.ApiNutrition = ApiNutrition;
window.ApiSleep = ApiSleep;
window.ApiHydration = ApiHydration;
window.ApiVitals = ApiVitals;
window.ApiGoals = ApiGoals;

console.log('API Client loaded - C# Backend ready at', API_BASE_URL);
