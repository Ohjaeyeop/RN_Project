import {configureStore} from '@reduxjs/toolkit';
import studyInfoReducer from '../redux/studyInfoSlice';
import todosReducer from '../redux/todosSlice';

export const store = configureStore({
  reducer: {
    studyInfo: studyInfoReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
