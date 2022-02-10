import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export type Todo = {
  title: string;
  body: string;
  complete: boolean;
};

type State = Todo[];

export const getTodos = createAsyncThunk(
  'todos/getTodos',
  async (username: string) => {
    const querySnapshot = await firestore()
      .collection('Todos')
      .doc(username)
      .get();
  },
);

export const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {},
});

export default todosSlice.reducer;
