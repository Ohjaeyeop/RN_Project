import React, {useEffect, useMemo, useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {ScrollView, TouchableOpacity, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../providers/UserProvider';
import {MemoListProps} from '../../navigation/MemoStackNavigator';

const MemoContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

type MemoObj = {
  id: string;
  date: string;
  text: string;
};

const Memo = ({navigation}: MemoListProps) => {
  const {user} = useUser();
  const memosRef = useMemo(
    () =>
      firestore().collection('Memo').doc(user?.username).collection('memos'),
    [user?.username],
  );
  const [memos, setMemos] = useState<MemoObj[]>([]);

  useEffect(() => {
    const subscriber = memosRef.onSnapshot(querySnapshot => {
      const list: MemoObj[] = [];
      querySnapshot?.forEach(doc => {
        const {date, text} = doc.data();
        list.push({id: doc.id, date, text});
      });
      setMemos(list);
    });

    return () => subscriber();
  }, [memosRef]);

  return (
    <MemoContainer>
      <ScreenHeader title={'메모'}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 20,
            bottom: 8,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('AddMemo')}>
            <Text style={{color: color.primary}}>메모 작성</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScreenHeader>
    </MemoContainer>
  );
};

export default Memo;
