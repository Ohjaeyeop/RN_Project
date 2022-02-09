import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {color} from '../../theme/color';

const AuthForm = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{padding: 50, flex: 1, justifyContent: 'center'}}>
      <Text style={styles.text}>Username:</Text>
      <TextInput
        style={styles.input}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={setUserName}
      />
      <Text style={styles.text}>Password:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={[styles.button, {marginTop: 20}]}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
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
