import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Memo from '../components/screen/Memo';
import AddMemo from '../components/memo/AddMemo';

type MemoStackParamList = {
  MemoList: undefined;
  AddMemo: {id?: string; username: string | undefined};
};

export type MemoListProps = NativeStackScreenProps<
  MemoStackParamList,
  'MemoList'
>;

export type AddMemoProps = NativeStackScreenProps<
  MemoStackParamList,
  'AddMemo'
>;

const MemoStack = createNativeStackNavigator<MemoStackParamList>();

const MemoStackNavigator = () => {
  return (
    <MemoStack.Navigator screenOptions={{headerShown: false}}>
      <MemoStack.Screen name="MemoList" component={Memo} />
      <MemoStack.Screen name="AddMemo" component={AddMemo} />
    </MemoStack.Navigator>
  );
};

export default MemoStackNavigator;
