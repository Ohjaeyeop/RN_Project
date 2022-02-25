import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Alert, View, Keyboard, Pressable} from 'react-native';
import {color, Theme} from '../../theme/color';
import {useUser} from '../../providers/UserProvider';
import styled from 'styled-components/native';
import {StyledText} from '../shared/StyledText';
import ScreenHeader from '../shared/ScreenHeader';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import Button from '../shared/Button';

const AuthFormContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const StyledTextInput = styled.TextInput`
  height: 40px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${color.gray};
  padding: 5px;
  margin-top: 8px;
  margin-bottom: 12px;
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const AuthForm = () => {
  const {setUser} = useUser();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const {setItem} = useAsyncStorage('user');

  const getUser = async () => {
    const user = await firestore()
      .collection('Users')
      .where('username', '==', username)
      .get();

    return user;
  };

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('입력되지 않은 필드가 있습니다.');
      return;
    }

    const user = await getUser();
    if (user.size > 0) {
      if (user.docs[0].data().password === password) {
        setUser({username: username});
        await setItem(JSON.stringify({username}));
        return;
      } else {
        Alert.alert('비밀번호가 일치하지 않습니다.');
      }
    } else {
      Alert.alert('존재하지 않는 ID 입니다.');
      setUserName('');
    }
    setPassword('');
  };

  const handleSignUp = async () => {
    if (!username || !password) {
      Alert.alert('입력되지 않은 필드가 있습니다.');
      return;
    }

    const isUserExist = await getUser().then(documentData => documentData.size);
    if (!isUserExist) {
      firestore()
        .collection('Users')
        .add({
          username: username,
          password: password,
        })
        .then(() => {
          setUser({username: username});
          setItem(JSON.stringify({username}));
        })
        .catch(err => {
          Alert.alert(err.message);
        });
    } else {
      Alert.alert('이미 존재하는 ID 입니다.');
      setUserName('');
      setPassword('');
    }
  };

  return (
    <AuthFormContainer>
      <Pressable style={{flex: 1}} onPress={() => Keyboard.dismiss()}>
        <ScreenHeader title={'로그인'} />
        <View style={{paddingHorizontal: 20}}>
          <StyledText>아이디</StyledText>
          <StyledTextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={setUserName}
            value={username}
          />
          <StyledText>비밀번호</StyledText>
          <StyledTextInput
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
          />
          <Button
            text={'로그인'}
            style={{
              backgroundColor: color.primary,
              width: '100%',
              padding: 12,
              marginVertical: 16,
            }}
            textColor={color.white}
            fontSize={14}
            onPress={handleSignIn}
          />
          <Button
            text={'회원가입'}
            style={{
              backgroundColor: color.primary,
              width: '100%',
              padding: 12,
              marginTop: 4,
            }}
            textColor={color.white}
            fontSize={14}
            onPress={handleSignUp}
          />
        </View>
      </Pressable>
    </AuthFormContainer>
  );
};

export default AuthForm;
