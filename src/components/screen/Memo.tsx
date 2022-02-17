import React, {useEffect, useMemo, useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../providers/UserProvider';
import {MemoListProps} from '../../navigation/MemoStackNavigator';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/AntDesign';

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

  const deleteMemo = async (id: string) => {
    await memosRef.doc(id).delete();
  };

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
      <SwipeListView
        data={memos}
        keyExtractor={memo => memo.timestamp}
        renderItem={({item}) => (
          <Pressable
            key={item.timestamp}
            style={{
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderColor: color.lightGray,
              paddingTop: 16,
              paddingBottom: 8,
              backgroundColor: 'white',
            }}
            onPress={() =>
              navigation.navigate('AddMemo', {
                id: item.id,
                username: user?.username,
              })
            }>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: color.dark,
              }}
              numberOfLines={1}>
              {item.text.split('\n')[0]}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: color.gray, marginRight: 8}}>
                {item.timestamp.slice(0, 10).split('-').join('.')}.
              </Text>
              <Text style={{color: color.gray}}>
                {item.text.split('\n')[1]
                  ? item.text.split('\n')[1]
                  : '추가 텍스트 없음'}
              </Text>
            </View>
          </Pressable>
        )}
        renderHiddenItem={({item}) => (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              backgroundColor: color.red,
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: '100%',
            }}
            onPress={() => deleteMemo(item.id)}>
            <Icon name={'delete'} size={25} color={'white'} />
          </TouchableOpacity>
        )}
        rightOpenValue={-70}
      />
    </MemoContainer>
  );
};

export default Memo;
