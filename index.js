/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {UserProvider} from './src/providers/UserProvider';

const RnApp = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};

AppRegistry.registerComponent(appName, () => RnApp);
