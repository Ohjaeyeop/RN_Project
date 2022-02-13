import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {color, Theme} from '../theme/color';
import DateUtil from '../utils/DateUtil';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../providers/UserProvider';
import {useFocusEffect} from '@react-navigation/native';

const CalendarView = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  border-radius: 12px;
  width: 100%;
  padding: 24px 15px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
  margin-bottom: 24px;
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

const Mark = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${color.primary};
  position: absolute;
  top: 0;
`;

const days = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar = ({today}: {today: number}) => {
  const {user} = useUser();
  const [selectedDate, setSelectedDate] = useState<number>(today);
  const firstDay = useRef(selectedDate);
  const [displayedDate, setDisplayedDate] = useState<number[]>([]);
  const [studiedDate, setStudiedDate] = useState<number[]>([]);

  const getStudyInfosByMonth = useCallback(
    async (date: number) => {
      if (!user) {
        return;
      }

      let dates: number[] = [];
      for (let i = Math.floor(date / 100) * 100 + 1; i <= date; i++) {
        const studyInfo = await firestore()
          .collection('StudyInfo')
          .doc(user.username)
          .collection(i.toString())
          .get();
        if (studyInfo.size > 0) {
          dates.push(i);
        }
      }
      setStudiedDate(dates);
    },
    [user],
  );

  const getCalendarInfo = useCallback((date: number) => {
    const lastDate = DateUtil.getLastDate(date);
    const lastDateOfPrevMonth = DateUtil.getLastDateOfPrevMonth(date);

    let dates: number[] = [];
    for (let i = firstDay.current - 1; i >= 0; i--) {
      dates.push(lastDateOfPrevMonth - i);
    }
    for (let i = Math.floor(lastDate / 100) * 100 + 1; i <= lastDate; i++) {
      dates.push(i);
    }
    setDisplayedDate(dates);
  }, []);

  useFocusEffect(
    useCallback(() => {
      firstDay.current = DateUtil.getFirstDay(selectedDate);
      getCalendarInfo(selectedDate);
      getStudyInfosByMonth(selectedDate);
    }, [getCalendarInfo, getStudyInfosByMonth, selectedDate]),
  );

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

      {[...new Array(Math.ceil(displayedDate.length / 7) + 1).keys()].map(i => {
        return (
          <RowBox key={i}>
            {[...new Array(7).keys()].map(j => {
              const index = i * 7 + j;
              return (
                <TextBox key={index + 7}>
                  {studiedDate.includes(displayedDate[index]) && <Mark />}
                  <Text
                    style={{
                      color:
                        index >= firstDay.current &&
                        index < displayedDate.length
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
