import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { type PayloadAction } from '@reduxjs/toolkit';
import { requestSlice } from '../slices/requestSlice';
import { type RootState } from '../reducers';

// Types for request payload
interface SendRequestPayload {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

// API call function
function* apiCall(url: string, options: RequestInit): Generator<any, any, any> {
  try {
    const response: Response = yield call(fetch, url, options);
    const data = yield call([response, 'json']);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    throw error;
  }
}

// Send request saga
function* sendRequestSaga(action: PayloadAction<SendRequestPayload>): Generator<any, void, any> {
  const { url, method, headers = {}, body } = action.payload;
  
  try {
    yield put(requestSlice.actions.setLoading(true));
    yield put(requestSlice.actions.clearError());
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    
    const result = yield call(apiCall, url, options);
    
    yield put(requestSlice.actions.setResponse({
      data: result.data,
      status: result.status,
      headers: Object.fromEntries(result.headers.entries()),
      url,
      method,
    }));
    
    yield put(requestSlice.actions.addToHistory({
      id: Date.now().toString(),
      url,
      method,
      headers,
      body,
      response: result.data,
      status: result.status,
      timestamp: new Date().toISOString(),
    }));
    
  } catch (error) {
    yield put(requestSlice.actions.setError({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 0,
    }));
  } finally {
    yield put(requestSlice.actions.setLoading(false));
  }
}

// Clear request history saga
function* clearHistorySaga(): Generator<any, void, any> {
  // You can add side effects here like saving to localStorage
  console.log('Request history cleared');
}

// Save request saga
function* saveRequestSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    // Save to localStorage or backend
    const currentState: RootState = yield select();
    const savedRequests = currentState.requests.savedRequests;
    
    localStorage.setItem('mypostman_saved_requests', JSON.stringify(savedRequests));
    
    yield put(requestSlice.actions.showNotification({
      type: 'success',
      message: 'Request saved successfully',
    }));
  } catch (error) {
    yield put(requestSlice.actions.showNotification({
      type: 'error',
      message: 'Failed to save request',
    }));
  }
}

// Load saved requests saga
function* loadSavedRequestsSaga(): Generator<any, void, any> {
  try {
    const saved = localStorage.getItem('mypostman_saved_requests');
    if (saved) {
      const savedRequests = JSON.parse(saved);
      yield put(requestSlice.actions.setSavedRequests(savedRequests));
    }
  } catch (error) {
    console.error('Failed to load saved requests:', error);
  }
}

// Watcher saga - listens for actions and triggers corresponding sagas
export function* watchRequestSagas(): Generator<any, void, any> {
  yield takeLatest(requestSlice.actions.sendRequest.type, sendRequestSaga);
  yield takeEvery(requestSlice.actions.clearHistory.type, clearHistorySaga);
  yield takeEvery(requestSlice.actions.saveRequest.type, saveRequestSaga);
  yield takeLatest(requestSlice.actions.loadSavedRequests.type, loadSavedRequestsSaga);
}
