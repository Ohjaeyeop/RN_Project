import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Subject} from '../data/study';
import {RootState} from './store';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import DateUtil from '../utils/DateUtil';

export type StudyInfo = {
  [subject in Subject]: number;
} & {total: number; date: number};

type State = {
  studyInfo: StudyInfo;
  updateState: 'idle' | 'loading' | 'succeeded';
};

const initialState: State = {
  studyInfo: {
    국어: 0,
    수학: 0,
    영어: 0,
    한국사: 0,
    기타: 0,
    total: 0,
    date: DateUtil.now(),
  },
  updateState: 'succeeded',
};

export const getUserRef = async (username: string) => {
  return await firestore()
    .collection('Users')
    .where('username', '==', username)
    .get();
};

export const getStudyInfoByPeriod = async (
  username: string,
  start: number,
  end: number,
) => {
  const userRef = await getUserRef(username);

  return await userRef.docs[0].ref
    .collection('StudyInfo')
    .where('date', '>=', start)
    .where('date', '<=', end)
    .get();
};

const getStudyInfoRef = async (
  userRef: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  date: number,
) => {
  return await userRef.docs[0].ref
    .collection('StudyInfo')
    .where('date', '==', date)
    .get();
};

export const getStudyInfo = createAsyncThunk(
  'studyInfo/getStudyInfo',
  async ({username, date}: {username: string; date: number}) => {
    try {
      const userRef = await getUserRef(username);
      const studyInfoRef = await getStudyInfoRef(userRef, date);
      return studyInfoRef.docs[0].data() as StudyInfo;
    } catch {
      return {...initialState.studyInfo, date: date};
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
    date: number;
    studyInfo: StudyInfo;
  }) => {
    if (studyInfo.total > 0) {
      try {
        const userRef = await getUserRef(username);
        const studyInfoRef = await getStudyInfoRef(userRef, date);
        await studyInfoRef.docs[0].ref.update(studyInfo);
      } catch {
        const userRef = await getUserRef(username);
        await userRef.docs[0].ref.collection('StudyInfo').add(studyInfo);
      }
    }

    return studyInfo;
  },
);

export const studyInfoSlice = createSlice({
  name: 'studyInfo',
  initialState,
  reducers: {
    increment: (
      state,
      action: PayloadAction<{subject: Subject; sec: number}>,
    ) => {
      state.studyInfo[action.payload.subject] += action.payload.sec;
      state.studyInfo.total += action.payload.sec;
    },
    setIdle: state => {
      state.updateState = 'idle';
    },
  },
  extraReducers: builder => {
    builder.addCase(getStudyInfo.fulfilled, (state, action) => {
      state.studyInfo = action.payload;
    });
    builder.addCase(updateStudyInfo.pending, state => {
      state.updateState = 'loading';
    });
    builder.addCase(updateStudyInfo.fulfilled, state => {
      state.updateState = 'succeeded';
    });
  },
});

export const {increment, setIdle} = studyInfoSlice.actions;
export const selectStudyInfo = (state: RootState) => state.studyInfo.studyInfo;
export const selectUpdateState = (state: RootState) =>
  state.studyInfo.updateState;
export default studyInfoSlice.reducer;
