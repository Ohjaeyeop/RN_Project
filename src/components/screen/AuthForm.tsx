import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {color, Theme} from '../../theme/color';
import {useUser} from '../../providers/UserProvider';
import styled from 'styled-components/native';

const AuthFormContainer = styled.View`
  padding: 50px;
  flex: 1;
  justify-content: center;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const StyledTextInput = styled.TextInput`
  height: 40px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${color.gray};
  padding: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const AuthForm = () => {
  const {setUser} = useUser();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

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
      <StyledText>Username:</StyledText>
      <StyledTextInput
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={setUserName}
        value={username}
      />
      <StyledText>Password:</StyledText>
      <StyledTextInput
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity
        style={[styles.button, {marginTop: 20}]}
        onPress={handleSignIn}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: color.primary,
    alignItems: 'center',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: color.white,
    fontWeight: 'bold',
  },
});

export default AuthForm;
