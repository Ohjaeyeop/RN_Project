import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {Animated, TouchableOpacity, Text, View, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../providers/UserProvider';
import {MemoListProps} from '../../navigation/MemoStackNavigator';
import Icon from 'react-native-vector-icons/AntDesign';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

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
  const swipeableRefs: (Swipeable | null)[] = useMemo(() => [], []);
  const opened = useRef<Swipeable | null>(null);

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

  const closeSwipeable = useCallback(
    (index: number) => {
      if (opened.current && opened.current !== swipeableRefs[index]) {
        opened.current?.close();
      }
      opened.current = swipeableRefs[index];
    },
    [swipeableRefs],
  );

  useFocusEffect(
    useCallback(() => {
      return () => closeSwipeable(-1);
    }, [closeSwipeable]),
  );

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    id: string,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [70, 0],
    });

    return (
      <Animated.View
        style={{
          backgroundColor: color.red,
          transform: [{translateX: trans}],
        }}>
        <RectButton
          style={{
            backgroundColor: color.red,
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            height: '100%',
          }}
          onPress={() => deleteMemo(id)}>
          <Icon name={'delete'} size={25} color={'white'} />
        </RectButton>
      </Animated.View>
    );
  };

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
      <FlatList
        data={memos}
        keyExtractor={memo => memo.timestamp}
        renderItem={({item, index}) => (
          <Swipeable
            friction={2}
            overshootRight={false}
            ref={ref => (swipeableRefs[index] = ref)}
            onSwipeableWillOpen={() => closeSwipeable(index)}
            renderRightActions={progress =>
              renderRightActions(progress, item.id)
            }>
            <RectButton
              style={[
                {
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderColor: color.lightGray,
                  paddingTop: 16,
                  paddingBottom: 8,
                },
              ]}
              onPress={() => {
                if (opened.current) {
                  opened.current?.close();
                  opened.current = null;
                } else {
                  navigation.navigate('AddMemo', {
                    id: item.id,
                    username: user?.username,
                  });
                }
              }}>
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
                <Text style={{color: color.gray}} numberOfLines={1}>
                  {item.text.split('\n')[1]
                    ? item.text.split('\n')[1]
                    : '추가 텍스트 없음'}
                </Text>
              </View>
            </RectButton>
          </Swipeable>
        )}
      />
    </MemoContainer>
  );
};

export default Memo;
