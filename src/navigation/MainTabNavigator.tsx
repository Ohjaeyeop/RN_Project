import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Diary from '../components/screen/Diary';
import Todos from '../components/screen/Todos';
import Setting from '../components/screen/Setting';
import StudyTimer from '../components/screen/StudyTimer';
import {Image} from 'react-native';
import {color, Theme} from '../theme/color';
import styled from 'styled-components/native';
import MemoStackNavigator from './MemoStackNavigator';

type TabParamList = {
  Diary: undefined;
  StudyTimer: undefined;
  Todos: undefined;
  Memo: undefined;
  Setting: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const FocusedText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
  font-size: 12px;
`;

const NonFocusedText = styled.Text`
  color: ${color.gray};
  font-size: 12px;
`;

const TabBarBackground = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  height: 100%;
  width: 100%;
`;

const TabBarLabel = ({focused, label}: {focused: boolean; label: string}) => {
  return focused ? (
    <FocusedText>{label}</FocusedText>
  ) : (
    <NonFocusedText>{label}</NonFocusedText>
  );
};

const MainTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => <TabBarBackground />,
          tabBarLabelPosition: 'below-icon',
        }}>
        <Tab.Screen
          name="Diary"
          component={Diary}
          options={{
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'캘린더'} />
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../../assets/calendar.png')}
                style={{width: 20, height: 20, opacity: focused ? 1 : 0.5}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Memo"
          component={MemoStackNavigator}
          options={{
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'메모'} />
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../../assets/notepad.png')}
                style={{width: 20, height: 20, opacity: focused ? 1 : 0.5}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="StudyTimer"
          component={StudyTimer}
          options={{
            title: '타이머',
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'타이머'} />
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../../assets/chronometer.png')}
                style={{width: 20, height: 20, opacity: focused ? 1 : 0.5}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Todos"
          component={Todos}
          options={{
            title: '투두',
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'투두'} />
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../../assets/to-do-list.png')}
                style={{width: 20, height: 20, opacity: focused ? 1 : 0.5}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Setting"
          component={Setting}
          options={{
            title: '설정',
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'설정'} />
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../../assets/gear.png')}
                style={{width: 20, height: 20, opacity: focused ? 1 : 0.5}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabNavigator;
