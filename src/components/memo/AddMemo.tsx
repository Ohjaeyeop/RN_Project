import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import ScreenHeader from '../shared/ScreenHeader';
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  AppState,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyledText} from '../shared/StyledText';
import {AddMemoProps} from '../../navigation/MemoStackNavigator';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

const MemoContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const StyledTextInput = styled.TextInput`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const StyledIcon = styled(Icon)`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const AddMemo = ({route, navigation}: AddMemoProps) => {
  const {username, id} = route.params;
  const memosRef = useMemo(
    () => firestore().collection('Memo').doc(username).collection('memos'),
    [username],
  );
  const textInputRef = useRef<TextInput | null>(null);
  const [text, setText] = useState('');
  const timerId = useRef<NodeJS.Timer>();
  const addMemo = useRef<() => Promise<void>>();
  const editMemo = useRef<() => Promise<void>>();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        memosRef
          .doc(id)
          .get()
          .then(doc => setText(doc.data()?.text));
      }
    }, [id, memosRef]),
  );

  useEffect(() => {
    const subscriber = AppState.addEventListener('change', state => {
      if (state === 'background') {
        timerId.current && loggingStop(timerId.current);
      }
    });
    return () => {
      timerId.current && loggingStop(timerId.current);
      subscriber.remove();
    };
  }, []);

  addMemo.current = async () => {
    text && (await memosRef.add({timestamp: new Date().toISOString(), text}));
  };

  editMemo.current = async () => {
    await memosRef.doc(id).update({timestamp: new Date().toISOString(), text});
  };

  const loggingStart = () => {
    logging();
    timerId.current = setInterval(logging, 30000);
  };

  const loggingStop = (id: NodeJS.Timer) => {
    clearInterval(id);
    timerId.current = undefined;
  };

  const logging = async () => {
    await analytics().logEvent('memo', {
      id: username,
      date: new Date().toISOString(),
    });
  };

  useEffect(() => {
    return () => {
      id ? editMemo.current?.() : addMemo.current?.();
    };
  }, [id]);

  return (
    <MemoContainer>
      <ScreenHeader title="">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            paddingHorizontal: 15,
          }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.pop()}>
            <StyledIcon name={'md-arrow-back-sharp'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => textInputRef.current?.blur()}>
            <StyledText style={{fontSize: 16}}>완료</StyledText>
          </TouchableOpacity>
        </View>
      </ScreenHeader>
      <Pressable
        style={{flex: 1}}
        onPress={() => textInputRef.current?.focus()}>
        <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
          <StyledTextInput
            ref={ref => (textInputRef.current = ref)}
            autoFocus={true}
            style={{fontSize: 16, fontWeight: '700'}}
            multiline={true}
            autoCorrect={false}
            autoCapitalize="none"
            value={text}
            onChangeText={text => {
              timerId.current || loggingStart();
              setText(text);
            }}
          />
        </ScrollView>
      </Pressable>
    </MemoContainer>
  );
};

export default AddMemo;
