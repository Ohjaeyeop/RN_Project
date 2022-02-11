/**
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Appearance, AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {UserProvider} from './src/providers/UserProvider';
import {ThemeProvider} from 'styled-components';
import {light, dark} from './src/theme/color';

const RnApp = () => {
  const [appTheme, setAppTheme] = useState(light);

  useEffect(() => {
    Appearance.addChangeListener(({colorScheme}) => {
      setAppTheme(Appearance.getColorScheme() === 'dark' ? dark : light);
    });
    return () => {};
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <Provider store={store}>
        <UserProvider>
          <App />
        </UserProvider>
      </Provider>
    </ThemeProvider>
  );
};

AppRegistry.registerComponent(appName, () => RnApp);
