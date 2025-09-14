import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface RequestResponse {
  data: any;
  status: number;
  headers: Record<string, string>;
  url: string;
  method: string;
  responseTime: number; // in milliseconds
  responseSize: number; // in bytes
}

export interface RequestError {
  message: string;
  status: number;
}

export interface RequestHistoryItem {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body?: any;
  response: any;
  status: number;
  timestamp: string;
}

export interface SavedRequest {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body?: any;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
}

interface RequestState {
  currentRequest: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers: Record<string, string>;
    params: Record<string, string>;
    body: string;
  };
  response: RequestResponse | null;
  error: RequestError | null;
  isLoading: boolean;
  history: RequestHistoryItem[];
  savedRequests: SavedRequest[];
  notification: Notification;
}

const initialState: RequestState = {
  currentRequest: {
    url: '',
    method: 'GET',
    headers: {},
    params: {},
    body: '',
  },
  response: null,
  error: null,
  isLoading: false,
  history: [],
  savedRequests: [],
  notification: {
    type: 'info',
    message: '',
    isVisible: false,
  },
};

export const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    // Current request actions
    setUrl: (state, action: PayloadAction<string>) => {
      state.currentRequest.url = action.payload;
    },
    setMethod: (state, action: PayloadAction<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>) => {
      state.currentRequest.method = action.payload;
    },
    setHeaders: (state, action: PayloadAction<Record<string, string>>) => {
      state.currentRequest.headers = action.payload;
    },
    addHeader: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.currentRequest.headers[action.payload.key] = action.payload.value;
    },
    removeHeader: (state, action: PayloadAction<string>) => {
      delete state.currentRequest.headers[action.payload];
    },
    setParams: (state, action: PayloadAction<Record<string, string>>) => {
      state.currentRequest.params = action.payload;
    },
    addParam: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.currentRequest.params[action.payload.key] = action.payload.value;
    },
    removeParam: (state, action: PayloadAction<string>) => {
      delete state.currentRequest.params[action.payload];
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.currentRequest.body = action.payload;
    },
    
    // Request execution actions (these trigger sagas)
    sendRequest: (state, _action: PayloadAction<{
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      headers?: Record<string, string>;
      body?: any;
    }>) => {
      // This action is handled by saga
      state.isLoading = true;
    },
    
    // Response actions (called by sagas)
    setResponse: (state, action: PayloadAction<RequestResponse>) => {
      state.response = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<RequestError>) => {
      state.error = action.payload;
      state.response = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearResponse: (state) => {
      state.response = null;
      state.error = null;
    },
    
    // History actions
    addToHistory: (state, action: PayloadAction<RequestHistoryItem>) => {
      state.history.unshift(action.payload);
      // Keep only last 100 items
      if (state.history.length > 100) {
        state.history = state.history.slice(0, 100);
      }
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(item => item.id !== action.payload);
    },
    clearHistory: (state) => {
      state.history = [];
    },
    
    // Saved requests actions
    saveRequest: (state, action: PayloadAction<Omit<SavedRequest, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newRequest: SavedRequest = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.savedRequests.push(newRequest);
    },
    updateSavedRequest: (state, action: PayloadAction<SavedRequest>) => {
      const index = state.savedRequests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.savedRequests[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteSavedRequest: (state, action: PayloadAction<string>) => {
      state.savedRequests = state.savedRequests.filter(req => req.id !== action.payload);
    },
    setSavedRequests: (state, action: PayloadAction<SavedRequest[]>) => {
      state.savedRequests = action.payload;
    },
    loadSavedRequests: () => {
      // This action triggers saga to load from localStorage
    },
    
    // Load saved request into current request
    loadSavedRequestToCurrent: (state, action: PayloadAction<string>) => {
      const savedRequest = state.savedRequests.find(req => req.id === action.payload);
      if (savedRequest) {
        state.currentRequest = {
          url: savedRequest.url,
          method: savedRequest.method as any,
          headers: savedRequest.headers,
          params: savedRequest.params,
          body: savedRequest.body ? JSON.stringify(savedRequest.body, null, 2) : '',
        };
      }
    },
    
    // Load history item into current request
    loadHistoryItemToCurrent: (state, action: PayloadAction<string>) => {
      const historyItem = state.history.find(item => item.id === action.payload);
      if (historyItem) {
        state.currentRequest = {
          url: historyItem.url,
          method: historyItem.method as any,
          headers: historyItem.headers,
          params: historyItem.params,
          body: historyItem.body ? JSON.stringify(historyItem.body, null, 2) : '',
        };
      }
    },
    
    // Notification actions
    showNotification: (state, action: PayloadAction<{ type: 'success' | 'error' | 'warning' | 'info'; message: string }>) => {
      state.notification = {
        ...action.payload,
        isVisible: true,
      };
    },
    hideNotification: (state) => {
      state.notification.isVisible = false;
    },
    
    // Reset current request
    resetCurrentRequest: (state) => {
      state.currentRequest = initialState.currentRequest;
      state.response = null;
      state.error = null;
    },
  },
});
