import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import Diary from '../components/screen/Diary';
import Todos from '../components/screen/Todos';
import Setting from '../components/screen/Setting';
import StudyTimer from '../components/screen/StudyTimer';
import Memo from '../components/screen/Memo';
import {View, Text} from 'react-native';
import {color, Theme} from '../theme/color';
import styled from 'styled-components/native';

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

const TabBarIcon = ({focused}: {focused: boolean}) => {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: focused ? color.primary : color.gray,
      }}
    />
  );
};

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
          tabBarBackground: () => <View />,
        }}>
        <Tab.Screen
          name="Diary"
          component={Diary}
          options={{
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'캘린더'} />
            ),
            tabBarIcon: ({focused}) => <TabBarIcon focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Memo"
          component={Memo}
          options={{
            tabBarLabel: ({focused}) => (
              <TabBarLabel focused={focused} label={'메모'} />
            ),
            tabBarIcon: ({focused}) => <TabBarIcon focused={focused} />,
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
            tabBarIcon: ({focused}) => <TabBarIcon focused={focused} />,
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
            tabBarIcon: ({focused}) => <TabBarIcon focused={focused} />,
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
            tabBarIcon: ({focused}) => <TabBarIcon focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabNavigator;
