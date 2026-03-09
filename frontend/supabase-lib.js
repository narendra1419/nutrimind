/**
 * Supabase Client Library Loader
 * ==============================
 * Loads the Supabase JavaScript client from CDN with proper initialization
 * and fallback handling for when Supabase is unavailable
 */

(function() {
  'use strict';

  // Supabase configuration
  const SUPABASE_URL = 'https://oqjsmldkvsbkpuxxjrtj.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xanNtbGRrdnNia3B1eHhqcnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjU5NjAsImV4cCI6MjA4ODYwMTk2MH0.KYZBFkzjdn3W1MB_oV2ll3NcMFLhfOU1u5xst-05ozI';

  // Version of Supabase JS client to use
  const SUPABASE_VERSION = '2.45.4';

  // Flag to track if Supabase is loaded
  window.SupabaseLibLoaded = false;
  window.SupabaseLibError = null;

  /**
   * Load Supabase from CDN
   */
  function loadSupabaseFromCDN() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.supabase) {
        console.log('Supabase already loaded');
        window.SupabaseLibLoaded = true;
        resolve(window.supabase);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${SUPABASE_VERSION}/dist/umd/supabase.min.js`;
      script.async = true;
      script.crossOrigin = 'anonymous';

      // Script loaded successfully
      script.onload = function() {
        console.log('Supabase library loaded from CDN');
        
        if (window.supabase) {
          window.SupabaseLibLoaded = true;
          resolve(window.supabase);
        } else {
          reject(new Error('Supabase library loaded but window.supabase is not defined'));
        }
      };

      // Script failed to load
      script.onerror = function(error) {
        console.error('Failed to load Supabase from CDN:', error);
        window.SupabaseLibError = 'Failed to load Supabase library from CDN';
        reject(error);
      };

      // Append script to head
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Supabase client
   */
  async function initializeSupabase() {
    try {
      const supabase = await loadSupabaseFromCDN();
      
      // Create the client
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'X-Client-Info': 'nutrimind-web-app'
          }
        },
        // Add retry configuration for better reliability
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });

      // Make available globally
      window.supabase = client;
      window.SupabaseClient = client;
      
      console.log('Supabase client initialized successfully');
      console.log('Supabase URL:', SUPABASE_URL);
      
      return client;
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      window.SupabaseLibError = error.message;
      return null;
    }
  }

  /**
   * Wait for Supabase to be available
   */
  async function waitForSupabase(maxAttempts = 15, delay = 500) {
    for (let i = 0; i < maxAttempts; i++) {
      if (window.SupabaseLibLoaded && window.supabase) {
        console.log('Supabase available after', i + 1, 'attempts');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    console.log('Supabase failed to load after', maxAttempts, 'attempts');
    return false;
  }

  /**
   * Initialize and expose functions
   */
  async function init() {
    // Start loading Supabase
    const client = await initializeSupabase();
    
    // If client failed to load, set up fallback
    if (!client) {
      console.log('Setting up localStorage fallback for Supabase');
      
      // Create a mock Supabase client for offline/localStorage mode
      window.supabase = createMockSupabaseClient();
      window.SupabaseClient = window.supabase;
      window.SupabaseLibLoaded = true; // Mark as "loaded" with fallback
    }

    // Dispatch event to notify other scripts
    document.dispatchEvent(new CustomEvent('supabaseReady', {
      detail: {
        available: !!window.supabase,
        client: window.supabase
      }
    }));

    return window.supabase;
  }

  /**
   * Create a mock Supabase client for localStorage fallback mode
   */
  function createMockSupabaseClient() {
    console.log('Creating mock Supabase client for localStorage fallback');
    
    // Return a minimal mock that matches the Supabase API structure
    return {
      auth: {
        signInWithPassword: async () => ({ 
          data: { user: null }, 
          error: { message: 'Supabase unavailable - using localStorage fallback' } 
        }),
        signUp: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase unavailable - using localStorage fallback' } 
        }),
        signOut: async () => ({}),
        getSession: async () => ({ 
          data: { session: null }, 
          error: null 
        }),
        getUser: async () => ({ 
          data: { user: null }, 
          error: { message: 'Supabase unavailable' } 
        }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        updateUser: async () => ({ 
          data: { user: null }, 
          error: { message: 'Supabase unavailable' } 
        }),
        resetPasswordForEmail: async () => ({ 
          error: { message: 'Supabase unavailable' } 
        })
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            single: async () => ({ data: null, error: { message: 'Supabase unavailable' } }),
            order: () => ({ 
              single: async () => ({ data: null, error: { message: 'Supabase unavailable' } }),
              limit: () => ({ 
                single: async () => ({ data: null, error: { message: 'Supabase unavailable' } })
              })
            }),
            gte: () => ({ 
              lte: () => ({ 
                order: () => ({ 
                  single: async () => ({ data: null, error: { message: 'Supabase unavailable' } }),
                  limit: () => ({ 
                    single: async () => ({ data: null, error: { message: 'Supabase unavailable' } })
                  })
                })
              })
            })
          }),
          insert: async () => ({ 
            select: () => ({ 
              single: async () => ({ data: null, error: { message: 'Supabase unavailable' } })
            }),
            error: { message: 'Supabase unavailable' }
          }),
          upsert: async () => ({ 
            select: () => ({ 
              single: async () => ({ data: null, error: { message: 'Supabase unavailable' } })
            }),
            error: { message: 'Supabase unavailable' }
          }),
          update: async () => ({ 
            eq: () => ({ 
              select: () => ({ 
                single: async () => ({ data: null, error: { message: 'Supabase unavailable' } })
              })
            })
          }),
          delete: async () => ({ 
            eq: async () => ({ error: { message: 'Supabase unavailable' } })
          })
        })
      }),
      // Add channel support for realtime (mock)
      channel: () => ({
        on: () => ({
          subscribe: () => ({ status: 'SUBSCRIBED' })
        })
      }),
      removeChannel: async () => {}
    };
  }

  // Start initialization immediately
  init();

  // Export initialization function for manual use if needed
  window.initSupabaseLib = init;
  window.waitForSupabaseLib = waitForSupabase;

  console.log('Supabase library loader initialized');

})();

