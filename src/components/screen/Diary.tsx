import React, {useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import Calendar from '../Calendar';
import {View, useWindowDimensions} from 'react-native';
import DateUtil from '../../utils/DateUtil';
import GraphBySubject from '../GraphBySubject';
import GraphByPeriod from '../GraphByPeriod';

const DiarayContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const DiaryScroll = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const DivisionLine = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.box2};
  margin-bottom: 24px;
  margin-top: 20px;
  height: 12px;
`;

const Diary = () => {
  const today = DateUtil.now();
  const width = useWindowDimensions().width;
  const [selectedDate, setSelectedDate] = useState(today);

  const selectDate = (date: number) => {
    setSelectedDate(date);
  };

  return (
    <DiarayContainer>
      <DiaryScroll>
        <ScreenHeader title={'캘린더'} />
        <View style={{paddingHorizontal: 20}}>
          <Calendar
            today={today}
            selectedDate={selectedDate}
            selectDate={selectDate}
          />
        </View>
        <GraphBySubject date={selectedDate} />
        <DivisionLine
          style={{
            width: width,
          }}
        />
        <GraphByPeriod date={today} />
      </DiaryScroll>
    </DiarayContainer>
  );
};

export default Diary;
