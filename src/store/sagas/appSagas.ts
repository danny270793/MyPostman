import { put, takeEvery, takeLatest, delay, select, call } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import i18n from '../../i18n';
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
    
    // Load user preferences and apply theme
    const savedTheme = localStorage.getItem('mypostman_theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      // Apply theme immediately to document element
      const documentElement = document.documentElement;
      if (savedTheme === 'dark') {
        documentElement.classList.add('dark');
        documentElement.setAttribute('data-theme', 'dark');
      } else {
        documentElement.classList.remove('dark');
        documentElement.setAttribute('data-theme', 'light');
      }
      
      yield put(appSlice.actions.setTheme(savedTheme as 'light' | 'dark'));
    } else {
      // Default to light theme and ensure it's applied
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Load language preference and sync with i18n
    const savedLanguage = localStorage.getItem('mypostman_language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      yield call([i18n, 'changeLanguage'], savedLanguage);
      yield put(appSlice.actions.setLanguage(savedLanguage));
    } else {
      // Sync Redux state with current i18n language (from browser detection)
      const currentLanguage = i18n.language;
      if (currentLanguage === 'en' || currentLanguage === 'es') {
        yield put(appSlice.actions.setLanguage(currentLanguage));
      } else {
        // Fallback to English if detected language is not supported
        yield call([i18n, 'changeLanguage'], 'en');
        yield put(appSlice.actions.setLanguage('en'));
      }
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
    
    // Apply theme to document element for Tailwind dark mode
    const documentElement = document.documentElement;
    
    if (action.payload === 'dark') {
      documentElement.classList.add('dark');
      documentElement.setAttribute('data-theme', 'dark');
    } else {
      documentElement.classList.remove('dark');
      documentElement.setAttribute('data-theme', 'light');
    }
    
    yield put(appSlice.actions.showNotification({
      type: 'success',
      message: `Theme changed to ${action.payload}`,
      duration: 2000, // Shorter duration for theme changes
    }));
  } catch (error) {
    yield put(appSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to update theme',
    }));
  }
}

// Update language saga
function* updateLanguageSaga(action: PayloadAction<'en' | 'es'>): Generator<any, void, any> {
  try {
    // Change i18n language using the call effect to handle the Promise
    yield call([i18n, 'changeLanguage'], action.payload);
    
    // Save to localStorage
    localStorage.setItem('mypostman_language', action.payload);
    
    yield put(appSlice.actions.showNotification({
      type: 'success',
      message: action.payload === 'en' ? 'Language changed to English' : 'Idioma cambiado a Español',
    }));
  } catch (error) {
    yield put(appSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to update language',
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
        language: currentState.app.language,
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

// Handle toggle theme saga - gets current theme and applies it
function* handleToggleThemeSaga(): Generator<any, void, any> {
  try {
    const currentState: RootState = yield select();
    const newTheme = currentState.app.theme;
    
    // Apply the theme directly to the document element
    localStorage.setItem('mypostman_theme', newTheme);
    
    const documentElement = document.documentElement;
    
    if (newTheme === 'dark') {
      documentElement.classList.add('dark');
      documentElement.setAttribute('data-theme', 'dark');
    } else {
      documentElement.classList.remove('dark');
      documentElement.setAttribute('data-theme', 'light');
    }
    
    yield put(appSlice.actions.showNotification({
      type: 'success',
      message: `Theme changed to ${newTheme}`,
      duration: 2000,
    }));
  } catch (error) {
    yield put(appSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to toggle theme',
    }));
  }
}

// Watcher saga - listens for app-related actions
export function* watchAppSagas(): Generator<any, void, any> {
  yield takeEvery(appSlice.actions.showNotification.type, autoHideNotificationSaga);
  yield takeLatest(appSlice.actions.initializeApp.type, initializeAppSaga);
  yield takeEvery(appSlice.actions.setTheme.type, updateThemeSaga);
  yield takeEvery(appSlice.actions.toggleTheme.type, handleToggleThemeSaga);
  yield takeEvery(appSlice.actions.setLanguage.type, updateLanguageSaga);
  yield takeEvery(appSlice.actions.setSidebarCollapsed.type, updateSidebarSaga);
  yield takeEvery(appSlice.actions.saveEnvironmentVariables.type, saveEnvironmentVariablesSaga);
  yield takeLatest(appSlice.actions.exportData.type, exportDataSaga);
  yield takeEvery(appSlice.actions.setError.type, logErrorSaga);
}
