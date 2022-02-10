/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {UserProvider} from './src/providers/UserProvider';

const RnApp = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RnApp);
