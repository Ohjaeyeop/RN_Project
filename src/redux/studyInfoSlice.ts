import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Subject} from '../components/screen/StudyTimer';
import {RootState} from './store';
import firestore from '@react-native-firebase/firestore';

export type StudyInfo = {
  [subject in Subject]: number;
} & {total: number};

type State = {
  studyInfo: StudyInfo;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
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
  status: 'idle',
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
    await firestore()
      .collection('StudyInfo')
      .doc(username)
      .collection(date)
      .doc('Info')
      .update(studyInfo);

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
    setIdle: state => {
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder.addCase(getStudyInfo.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getStudyInfo.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.studyInfo = action.payload;
    });
    builder.addCase(getStudyInfo.rejected, state => {
      state.status = 'failed';
    });
    builder.addCase(updateStudyInfo.fulfilled, (state, action) => {
      state.studyInfo = action.payload;
    });
  },
});

export const {increment, setIdle} = studyInfoSlice.actions;
export const selectStudyInfo = (state: RootState) => state.studyInfo.studyInfo;
export default studyInfoSlice.reducer;
