import { combineReducers } from '@reduxjs/toolkit';
import { requestSlice } from '../slices/requestSlice';
import { appSlice } from '../slices/appSlice';

export const rootReducer = combineReducers({
  requests: requestSlice.reducer,
  app: appSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
