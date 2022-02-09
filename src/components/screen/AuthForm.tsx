import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {color} from '../../theme/color';

const AuthForm = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !password) {
      Alert.alert('입력되지 않은 필드가 있습니다.');
      return;
    }

    const user = await firestore()
      .collection('Users')
      .where('username', '==', username)
      .get();

    if (user.size === 0) {
      firestore()
        .collection('Users')
        .add({
          username: username,
          password: password,
        })
        .then(() => {
          console.log('User added');
        })
        .catch(err => {
          Alert.alert(err.message);
        });
    } else {
      Alert.alert('이미 존재하는 ID 입니다.');
    }

    setUserName('');
    setPassword('');
  };

  return (
    <View style={{padding: 50, flex: 1, justifyContent: 'center'}}>
      <Text style={styles.text}>Username:</Text>
      <TextInput
        style={styles.input}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={setUserName}
        value={username}
      />
      <Text style={styles.text}>Password:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={[styles.button, {marginTop: 20}]}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: color.dark,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.gray,
    padding: 5,
    marginVertical: 15,
  },
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
