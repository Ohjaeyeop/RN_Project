import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Theme} from '../theme/color';
import DateUtil from '../utils/DateUtil';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CalendarView = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  border-radius: 12px;
  width: 100%;
  height: 400px;
  padding: 24px;
`;

const StyledIcon = styled(Icon)`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const days = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar = () => {
  const today = DateUtil.now();
  const [selectedDate, setSelectedDate] = useState<number>(today);
  const lastDate = useState(DateUtil.getLastDate(2022, 2));

  return (
    <CalendarView>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <StyledIcon name={'arrow-left'} size={20} onPress={() => {}} />
        <Text style={{fontSize: 18, fontWeight: '700'}}>
          {DateUtil.yearMonth(selectedDate)}
        </Text>
        <StyledIcon name={'arrow-right'} size={20} onPress={() => {}} />
      </View>
      {days.map(day => (
        <View key={day}>
          <Text>{day}</Text>
        </View>
      ))}
      {[...new Array(6).keys()].map(() => {
        return days.map(() => {});
      })}
    </CalendarView>
  );
};

export default Calendar;
