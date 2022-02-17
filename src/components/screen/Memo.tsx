import React, {useEffect, useMemo, useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {ScrollView, TouchableOpacity, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../providers/UserProvider';
import {MemoListProps} from '../../navigation/MemoStackNavigator';

const MemoContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

type MemoObj = {
  id: string;
  timestamp: string;
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
        const {timestamp, text} = doc.data();
        list.push({id: doc.id, timestamp, text});
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddMemo', {username: user?.username})
            }>
            <Text style={{color: color.primary}}>메모 작성</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScreenHeader>
      <ScrollView style={{flex: 1}}>
        {memos.map((memo, index) => (
          <TouchableOpacity
            key={memo.timestamp}
            style={{
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderColor: color.lightGray,
              paddingTop: index === 0 ? 0 : 16,
              paddingBottom: 8,
            }}
            onPress={() =>
              navigation.navigate('AddMemo', {
                id: memo.id,
                username: user?.username,
              })
            }>
            <Text style={{fontSize: 16, fontWeight: '700', color: color.dark}}>
              {memo.text.split('\n')[0]}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: color.gray, marginRight: 8}}>
                {memo.timestamp.slice(0, 10).split('-').join('.')}.
              </Text>
              <Text style={{color: color.gray}}>
                {memo.text.split('\n')[1]
                  ? memo.text.split('\n')[1]
                  : '추가 텍스트 없음'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </MemoContainer>
  );
};

export default Memo;
