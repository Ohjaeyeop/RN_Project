import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {color, Theme} from '../theme/color';
import DateUtil from '../utils/DateUtil';
import {ActivityIndicator, Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../providers/UserProvider';
import {useFocusEffect} from '@react-navigation/native';
import {StyledText} from './shared/StyledText';
import {getStudyInfoByPeriod, selectUpdateState} from '../redux/studyInfoSlice';
import {useAppSelector} from '../hooks/useReduxFunction';

const CalendarView = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  border-radius: 12px;
  width: 100%;
  padding: 24px 15px;
  margin-bottom: 24px;
`;

const RowBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const TextBox = styled.Pressable`
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
  top: 1px;
`;

const Days = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.subText};
`;

const Date = styled.Text`
  color: ${({
    index,
    firstDay,
    length,
    theme,
  }: {
    index: number;
    firstDay: number;
    length: number;
    theme: Theme;
  }) => (index >= firstDay && index < length ? color.gray : theme.box)};
`;

const days = ['일', '월', '화', '수', '목', '금', '토'];

type Props = {
  today: number;
  selectedDate: number;
  selectDate: (date: number) => void;
};

const Calendar = ({today, selectedDate, selectDate}: Props) => {
  const {user} = useUser();
  const [lastDate, setLastDate] = useState<number>(today);
  const firstDay = useRef(0);
  const [displayedDates, setDisplayedDates] = useState<number[]>([]);
  const [studiedDates, setStudiedDates] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const updateState = useAppSelector(selectUpdateState);

  const getStudyInfosByMonth = useCallback(
    async (date: number) => {
      if (!user) {
        return;
      }

      let dates: number[] = [];
      setLoading(true);
      await getStudyInfoByPeriod(
        user.username,
        Math.floor(date / 100) * 100 + 1,
        date,
      ).then(querySnapshot => {
        querySnapshot.docs.map(doc => dates.push(doc.data().date));
      });
      setStudiedDates(dates);
      setLoading(false);
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
    setDisplayedDates(dates);
  }, []);

  const changeCalendar = useCallback(
    async (date: number) => {
      firstDay.current = DateUtil.getFirstDay(date);
      await getStudyInfosByMonth(date);
      getCalendarInfo(date);
    },
    [getCalendarInfo, getStudyInfosByMonth],
  );

  useFocusEffect(
    useCallback(() => {
      setLastDate(today);
      if (updateState === 'succeeded') {
        changeCalendar(today);
      }
    }, [changeCalendar, updateState, today]),
  );

  const changeToPrevMonth = () => {
    const changedDate = DateUtil.getLastDateOfPrevMonth(lastDate);
    setLastDate(changedDate);
    changeCalendar(changedDate);
  };

  const changeToNextMonth = () => {
    let changedDate = DateUtil.getLastDateOfNextMonth(lastDate);
    changedDate =
      DateUtil.getMonth(changedDate) === DateUtil.getMonth(today)
        ? today
        : changedDate;
    setLastDate(changedDate);
    changeCalendar(changedDate);
  };

  return (
    <CalendarView
      style={Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 4},
          shadowRadius: 12,
          shadowOpacity: 0.12,
        },
        android: {elevation: 3},
      })}>
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
        <StyledText
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginHorizontal: 12,
          }}>
          {DateUtil.yearMonth(lastDate)}
        </StyledText>
        <Icon
          name={'arrow-right'}
          size={25}
          color={lastDate !== today ? color.primary : color.gray}
          onPress={lastDate !== today ? changeToNextMonth : undefined}
        />
      </View>
      <RowBox>
        {days.map(day => (
          <TextBox key={day}>
            <Days>{day}</Days>
          </TextBox>
        ))}
      </RowBox>
      {loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 40 * (Math.ceil(displayedDates.length / 7) + 1),
          }}>
          <ActivityIndicator color={color.primary} />
        </View>
      ) : (
        [...new Array(Math.ceil(displayedDates.length / 7) + 1).keys()].map(
          i => {
            return (
              <RowBox key={i}>
                {[...new Array(7).keys()].map(j => {
                  const index = i * 7 + j;
                  return (
                    <TextBox
                      key={index + 7}
                      style={
                        displayedDates[index] === selectedDate && {
                          borderRadius: 20,
                          borderWidth: 2,
                          borderColor: color.subPrimary,
                        }
                      }
                      onPress={
                        index >= firstDay.current &&
                        index < displayedDates.length
                          ? () => selectDate(displayedDates[index])
                          : undefined
                      }>
                      {studiedDates.includes(displayedDates[index]) && <Mark />}
                      <Date
                        index={index}
                        firstDay={firstDay.current}
                        length={displayedDates.length}>
                        {index < displayedDates.length
                          ? displayedDates[index] % 100
                          : index - displayedDates.length + 1}
                      </Date>
                    </TextBox>
                  );
                })}
              </RowBox>
            );
          },
        )
      )}
    </CalendarView>
  );
};

export default Calendar;
