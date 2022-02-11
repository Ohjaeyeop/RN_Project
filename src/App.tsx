import React from 'react';
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthForm from './components/screen/AuthForm';
import {useUser} from './providers/UserProvider';

const App = () => {
  /*const {user} = useUser();
  return user === undefined ? <AuthForm /> : <MainTabNavigator />;*/
  return <MainTabNavigator />;
};

export default App;
