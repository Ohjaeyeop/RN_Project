import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export type Todo = {
  title: string;
  body: string;
  complete: boolean;
};

export const getTodos = createAsyncThunk(
  'todos/getTodos',
  async (username: string) => {
    const querySnapshot = await firestore()
      .collection('Todo')
      .doc(username)
      .collection('todos')
      .get();

    let todos: Todo[] = [];
    querySnapshot.forEach(documentSnapshot =>
      todos.push(documentSnapshot.data()),
    );

    return todos;
  },
);

export const addTodos = createAsyncThunk(
  'todos/addTodos',
  async ({username, todo}: {username: string; todo: Todo}) => {
    await firestore().collection('Todo').doc(username).collection('todos').add;
  },
);

export const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTodos.fulfilled, (state, action) => {
      state = action.payload;
    });
  },
});

export default todosSlice.reducer;
