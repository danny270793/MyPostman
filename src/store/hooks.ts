import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for specific slices
export const useRequestState = () => useAppSelector(state => state.requests);
export const useAppState = () => useAppSelector(state => state.app);

// Specific selector hooks for common use cases
export const useCurrentRequest = () => useAppSelector(state => state.requests.currentRequest);
export const useRequestResponse = () => useAppSelector(state => state.requests.response);
export const useRequestError = () => useAppSelector(state => state.requests.error);
export const useRequestLoading = () => useAppSelector(state => state.requests.isLoading);
export const useRequestHistory = () => useAppSelector(state => state.requests.history);
export const useSavedRequests = () => useAppSelector(state => state.requests.savedRequests);

export const useTheme = () => useAppSelector(state => state.app.theme);
export const useLanguage = () => useAppSelector(state => state.app.language);
export const useSidebarCollapsed = () => useAppSelector(state => state.app.sidebarCollapsed);
export const useActiveTab = () => useAppSelector(state => state.app.activeTab);
export const useEnvironmentVariables = () => useAppSelector(state => state.app.environmentVariables);
export const useActiveEnvironment = () => useAppSelector(state => state.app.activeEnvironment);
export const useAppNotification = () => useAppSelector(state => state.app.notification);
export const useAppError = () => useAppSelector(state => state.app.error);
export const useAppInitialized = () => useAppSelector(state => state.app.isInitialized);
export const useAppLoading = () => useAppSelector(state => state.app.isLoading);
