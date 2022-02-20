import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthForm from './components/screen/AuthForm';
import {useUser} from './providers/UserProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

const App = () => {
  const {getItem} = useAsyncStorage('user');
  const {user, setUser} = useUser();
  const isLogin = useRef<() => void>();

  isLogin.current = async () => {
    try {
      const value = await getItem();
      if (value) {
        const user = JSON.parse(value);
        setUser(user);
      }
    } catch {
      setUser(undefined);
    }
  };

  useEffect(() => {
    isLogin.current?.();
  }, []);

  return user === undefined ? (
    <SafeAreaProvider>
      <AuthForm />
    </SafeAreaProvider>
  ) : (
    <MainTabNavigator />
  );
};

export default App;
