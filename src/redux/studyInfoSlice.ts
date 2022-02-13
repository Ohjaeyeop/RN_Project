import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Subject} from '../data/study';
import {RootState} from './store';
import firestore from '@react-native-firebase/firestore';

export type StudyInfo = {
  [subject in Subject]: number;
} & {total: number};

type State = {
  studyInfo: StudyInfo;
  status: 'loading' | 'succeeded';
};

const initialState: State = {
  studyInfo: {
    국어: 0,
    수학: 0,
    영어: 0,
    한국사: 0,
    기타: 0,
    total: 0,
  },
  status: 'loading',
};

export const getStudyInfo = createAsyncThunk(
  'studyInfo/getStudyInfo',
  async ({username, date}: {username: string; date: string}) => {
    try {
      const studyInfoRef = await firestore()
        .collection('StudyInfo')
        .doc(username)
        .collection(date)
        .get();
      return studyInfoRef.docs[0].data() as StudyInfo;
    } catch {
      return initialState.studyInfo;
    }
  },
);

export const updateStudyInfo = createAsyncThunk(
  'studyInfo/updateStudyInfo',
  async ({
    username,
    date,
    studyInfo,
  }: {
    username: string;
    date: string;
    studyInfo: StudyInfo;
  }) => {
    if (studyInfo.total > 0) {
      try {
        await firestore()
          .collection('StudyInfo')
          .doc(username)
          .collection(date)
          .doc('Info')
          .update(studyInfo);
      } catch {
        await firestore()
          .collection('StudyInfo')
          .doc(username)
          .collection(date)
          .doc('Info')
          .set(studyInfo);
      }
    }

    return studyInfo;
  },
);

export const studyInfoSlice = createSlice({
  name: 'studyInfo',
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<Subject>) => {
      state.studyInfo[action.payload] += 1;
      state.studyInfo.total += 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(getStudyInfo.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getStudyInfo.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.studyInfo = action.payload;
      console.log(state.studyInfo);
    });
    builder.addCase(updateStudyInfo.fulfilled, (state, action) => {
      state.studyInfo = action.payload;
    });
  },
});

export const {increment} = studyInfoSlice.actions;
export const selectStudyInfo = (state: RootState) => state.studyInfo.studyInfo;
export default studyInfoSlice.reducer;
