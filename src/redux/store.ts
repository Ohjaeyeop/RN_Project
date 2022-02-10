import {configureStore} from '@reduxjs/toolkit';
import studyInfoReducer from '../redux/studyInfoSlice';

export const store = configureStore({
  reducer: {
    studyInfo: studyInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
