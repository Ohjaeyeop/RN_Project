import React from 'react';
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthForm from './components/screen/AuthForm';
import {useUser} from './providers/UserProvider';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const {user} = useUser();
  return user === undefined ? (
    <SafeAreaProvider>
      <AuthForm />
    </SafeAreaProvider>
  ) : (
    <MainTabNavigator />
  );
};

export default App;
