import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {color, Theme} from '../theme/color';
import DateUtil from '../utils/DateUtil';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../providers/UserProvider';

const CalendarView = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  border-radius: 12px;
  width: 100%;
  height: 400px;
  padding: 24px 15px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
`;

const RowBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const TextBox = styled.View`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const days = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar = () => {
  const {user} = useUser();
  const today = DateUtil.now();
  const [selectedDate, setSelectedDate] = useState<number>(today);

  const getStudyInfosByMonth = async () => {
    if (user) {
      const info = await firestore()
        .collection('StudyInfo')
        .doc(user.username)
        .collection();

      console.log(info);
    }
  };

  const lastDate = DateUtil.getLastDate(selectedDate);
  const lastDateOfPrevMonth = DateUtil.getLastDateOfPrevMonth(selectedDate);
  const firstDate = DateUtil.getFirstDay(selectedDate);

  let displayedDate: number[] = [];
  for (let i = firstDate - 1; i >= 0; i--) {
    displayedDate.push(lastDateOfPrevMonth - i);
  }
  for (let i = Math.floor(lastDate / 100) * 100 + 1; i <= lastDate; i++) {
    displayedDate.push(i);
  }
  const row = Math.ceil(displayedDate.length / 7) + 1;

  const changeToPrevMonth = () => {
    const changedDate = DateUtil.getLastDateOfPrevMonth(selectedDate);
    setSelectedDate(changedDate);
  };

  const changeToNextMonth = () => {
    const changedDate = DateUtil.getLastDateOfNextMonth(selectedDate);
    DateUtil.getMonth(changedDate) === DateUtil.getMonth(today)
      ? setSelectedDate(today)
      : setSelectedDate(changedDate);
  };

  return (
    <CalendarView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <Icon
          name={'arrow-left'}
          size={25}
          color={color.primary}
          onPress={changeToPrevMonth}
        />
        <Text style={{fontSize: 18, fontWeight: '700', marginHorizontal: 12}}>
          {DateUtil.yearMonth(selectedDate)}
        </Text>
        <Icon
          name={'arrow-right'}
          size={25}
          color={selectedDate !== today ? color.primary : color.gray}
          onPress={selectedDate !== today ? changeToNextMonth : undefined}
        />
      </View>
      <RowBox>
        {days.map(day => (
          <TextBox key={day}>
            <Text
              style={{
                color: color.navy,
              }}>
              {day}
            </Text>
          </TextBox>
        ))}
      </RowBox>

      {[...new Array(row).keys()].map(i => {
        return (
          <RowBox key={i}>
            {[...new Array(7).keys()].map(j => {
              const index = i * 7 + j;
              return (
                <TextBox key={index + 7}>
                  <Text
                    style={{
                      color:
                        index >= firstDate && index < displayedDate.length
                          ? color.gray
                          : color.lightGray,
                    }}>
                    {index < displayedDate.length
                      ? displayedDate[index] % 100
                      : index - displayedDate.length + 1}
                  </Text>
                </TextBox>
              );
            })}
          </RowBox>
        );
      })}
    </CalendarView>
  );
};

export default Calendar;
