import React, {useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import Calendar from '../Calendar';
import {View, Text} from 'react-native';
import DateUtil from '../../utils/DateUtil';
import ChartBySubject from '../ChartBySubject';

const DiaryContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Diary = () => {
  const today = DateUtil.now();
  const [selectedDate, setSelectedDate] = useState(today);

  const selectDate = (date: number) => {
    setSelectedDate(date);
  };

  return (
    <DiaryContainer>
      <ScreenHeader title={'캘린더'} />
      <Calendar today={today} />
      <ChartBySubject date={selectedDate} />
    </DiaryContainer>
  );
};

export default Diary;
