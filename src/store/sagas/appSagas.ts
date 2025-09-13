import { put, takeEvery, takeLatest, delay, select } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { appSlice } from '../slices/appSlice';
import type { RootState } from '../reducers';

// Types
interface ShowNotificationPayload {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Auto-hide notification saga
function* autoHideNotificationSaga(action: PayloadAction<ShowNotificationPayload>): Generator<any, void, any> {
  const { duration = 5000 } = action.payload;
  
  if (duration > 0) {
    yield delay(duration);
    yield put(appSlice.actions.hideNotification());
  }
}

// Initialize app saga
function* initializeAppSaga(): Generator<any, void, any> {
  try {
    yield put(appSlice.actions.setLoading(true));
    
    // Load user preferences
    const savedTheme = localStorage.getItem('mypostman_theme');
    if (savedTheme) {
      yield put(appSlice.actions.setTheme(savedTheme as 'light' | 'dark'));
    }
    
    // Load sidebar state
    const sidebarState = localStorage.getItem('mypostman_sidebar_collapsed');
    if (sidebarState !== null) {
      yield put(appSlice.actions.setSidebarCollapsed(JSON.parse(sidebarState)));
    }
    
    // Load environment variables
    const savedEnvVars = localStorage.getItem('mypostman_env_vars');
    if (savedEnvVars) {
      const envVars = JSON.parse(savedEnvVars);
      yield put(appSlice.actions.setEnvironmentVariables(envVars));
    }
    
    yield put(appSlice.actions.setInitialized(true));
    
  } catch (error) {
    yield put(appSlice.actions.setError(
      error instanceof Error ? error.message : 'Failed to initialize app'
    ));
  } finally {
    yield put(appSlice.actions.setLoading(false));
  }
}

// Update theme saga
function* updateThemeSaga(action: PayloadAction<'light' | 'dark'>): Generator<any, void, any> {
  try {
    localStorage.setItem('mypostman_theme', action.payload);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', action.payload);
    
    yield put(appSlice.actions.showNotification({
      type: 'success',
      message: `Theme changed to ${action.payload}`,
    }));
  } catch (error) {
    yield put(appSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to update theme',
    }));
  }
}

// Update sidebar state saga
function* updateSidebarSaga(action: PayloadAction<boolean>): Generator<any, void, any> {
  try {
    localStorage.setItem('mypostman_sidebar_collapsed', JSON.stringify(action.payload));
  } catch (error) {
    console.error('Failed to save sidebar state:', error);
  }
}

// Save environment variables saga
function* saveEnvironmentVariablesSaga(): Generator<any, void, any> {
  try {
    const currentState: RootState = yield select();
    const envVars = currentState.app.environmentVariables;
    
    localStorage.setItem('mypostman_env_vars', JSON.stringify(envVars));
    
    yield put(appSlice.actions.showNotification({
      type: 'success',
      message: 'Environment variables saved',
    }));
  } catch (error) {
    yield put(appSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to save environment variables',
    }));
  }
}

// Export data saga
function* exportDataSaga(): Generator<any, void, any> {
  try {
    const currentState: RootState = yield select();
    
    const exportData = {
      requests: currentState.requests.savedRequests,
      history: currentState.requests.history,
      environmentVariables: currentState.app.environmentVariables,
      settings: {
        theme: currentState.app.theme,
        sidebarCollapsed: currentState.app.sidebarCollapsed,
      },
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `mypostman-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    yield put(appSlice.actions.showNotification({
      type: 'success',
      message: 'Data exported successfully',
    }));
    
  } catch (error) {
    yield put(appSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to export data',
    }));
  }
}

// Error logging saga
function* logErrorSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    // Here you could send errors to a logging service
    console.error('App Error:', action.payload);
    
    // Store error in localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('mypostman_errors') || '[]');
    errors.push({
      message: action.payload,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 10 errors
    if (errors.length > 10) {
      errors.splice(0, errors.length - 10);
    }
    
    localStorage.setItem('mypostman_errors', JSON.stringify(errors));
    
  } catch (error) {
    console.error('Failed to log error:', error);
  }
}

// Watcher saga - listens for app-related actions
export function* watchAppSagas(): Generator<any, void, any> {
  yield takeEvery(appSlice.actions.showNotification.type, autoHideNotificationSaga);
  yield takeLatest(appSlice.actions.initializeApp.type, initializeAppSaga);
  yield takeEvery(appSlice.actions.setTheme.type, updateThemeSaga);
  yield takeEvery(appSlice.actions.setSidebarCollapsed.type, updateSidebarSaga);
  yield takeEvery(appSlice.actions.saveEnvironmentVariables.type, saveEnvironmentVariablesSaga);
  yield takeLatest(appSlice.actions.exportData.type, exportDataSaga);
  yield takeEvery(appSlice.actions.setError.type, logErrorSaga);
}
