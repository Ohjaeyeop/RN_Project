import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Subject} from '../components/screen/StudyTimer';
import {RootState} from './store';

type StudyInfo = {
  [subject in Subject]: number;
};

const initialState: StudyInfo & {total: number} = {
  국어: 0,
  수학: 0,
  영어: 0,
  한국사: 0,
  기타: 0,
  total: 0,
};

export const studyInfoSlice = createSlice({
  name: 'studyInfo',
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<Subject>) => {
      state[action.payload] += 1;
      state.total += 1;
    },
  },
});

export const {increment} = studyInfoSlice.actions;
export const selectStudyInfo = (state: RootState) => state.studyInfo;
export default studyInfoSlice.reducer;
