import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface EnvironmentVariable {
  key: string;
  value: string;
  enabled: boolean;
}

export interface AppNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
}

interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'es';
  sidebarCollapsed: boolean;
  activeTab: 'request' | 'history' | 'saved' | 'settings';
  environmentVariables: EnvironmentVariable[];
  activeEnvironment: string | null;
  notification: AppNotification;
  error: string | null;
  version: string;
}

const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  theme: 'light',
  language: 'en',
  sidebarCollapsed: true,
  activeTab: 'request',
  environmentVariables: [],
  activeEnvironment: null,
  notification: {
    type: 'info',
    message: '',
    isVisible: false,
  },
  error: null,
  version: '1.0.0',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Initialization actions
    initializeApp: (state) => {
      state.isLoading = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Language actions
    setLanguage: (state, action: PayloadAction<'en' | 'es'>) => {
      state.language = action.payload;
    },
    
    // Sidebar actions
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    // Tab navigation
    setActiveTab: (state, action: PayloadAction<'request' | 'history' | 'saved' | 'settings'>) => {
      state.activeTab = action.payload;
    },
    
    // Environment variables
    setEnvironmentVariables: (state, action: PayloadAction<EnvironmentVariable[]>) => {
      state.environmentVariables = action.payload;
    },
    addEnvironmentVariable: (state, action: PayloadAction<Omit<EnvironmentVariable, 'enabled'>>) => {
      const newVar: EnvironmentVariable = {
        ...action.payload,
        enabled: true,
      };
      
      // Check if variable already exists
      const existingIndex = state.environmentVariables.findIndex(
        env => env.key === newVar.key
      );
      
      if (existingIndex !== -1) {
        state.environmentVariables[existingIndex] = newVar;
      } else {
        state.environmentVariables.push(newVar);
      }
    },
    updateEnvironmentVariable: (state, action: PayloadAction<EnvironmentVariable>) => {
      const index = state.environmentVariables.findIndex(
        env => env.key === action.payload.key
      );
      
      if (index !== -1) {
        state.environmentVariables[index] = action.payload;
      }
    },
    removeEnvironmentVariable: (state, action: PayloadAction<string>) => {
      state.environmentVariables = state.environmentVariables.filter(
        env => env.key !== action.payload
      );
    },
    toggleEnvironmentVariable: (state, action: PayloadAction<string>) => {
      const variable = state.environmentVariables.find(env => env.key === action.payload);
      if (variable) {
        variable.enabled = !variable.enabled;
      }
    },
    saveEnvironmentVariables: () => {
      // This action triggers saga to save to localStorage
    },
    
    // Active environment
    setActiveEnvironment: (state, action: PayloadAction<string | null>) => {
      state.activeEnvironment = action.payload;
    },
    
    // Notification actions
    showNotification: (state, action: PayloadAction<{ 
      type: 'success' | 'error' | 'warning' | 'info'; 
      message: string;
      duration?: number;
    }>) => {
      state.notification = {
        type: action.payload.type,
        message: action.payload.message,
        isVisible: true,
      };
    },
    hideNotification: (state) => {
      state.notification.isVisible = false;
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Data export/import actions (handled by sagas)
    exportData: () => {
      // This action triggers saga
    },
    importData: (_state, _action: PayloadAction<any>) => {
      // This action triggers saga
    },
    
    // Reset app state
    resetApp: () => {
      return {
        ...initialState,
        isInitialized: true, // Keep initialized state
      };
    },
    
    // Update version
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
  },
});
