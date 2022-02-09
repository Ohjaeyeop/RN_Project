import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Diary from '../components/screen/Diary';
import Todo from '../components/screen/Todo';
import Setting from '../components/screen/Setting';
import StudyTimer from '../components/screen/StudyTimer';
import Memo from '../components/screen/Memo';

type TabParamList = {
  Diary: undefined;
  StudyTimer: undefined;
  Todo: undefined;
  Memo: undefined;
  Setting: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Diary" component={Diary} />
        <Tab.Screen name="StudyTimer" component={StudyTimer} />
        <Tab.Screen name="Todo" component={Todo} />
        <Tab.Screen name="Memo" component={Memo} />
        <Tab.Screen name="Setting" component={Setting} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabNavigator;
