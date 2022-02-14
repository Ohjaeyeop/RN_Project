import React, {useState} from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import Calendar from '../Calendar';
import {View, Text, Dimensions, SafeAreaView} from 'react-native';
import DateUtil from '../../utils/DateUtil';
import GraphBySubject from '../GraphBySubject';
import GraphByPeriod from '../GraphByPeriod';

const DiaryContainer = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Diary = () => {
  const today = DateUtil.now();
  const [selectedDate, setSelectedDate] = useState(today);

  const selectDate = (date: number) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <DiaryContainer>
        <ScreenHeader title={'캘린더'} />
        <View style={{paddingHorizontal: 20}}>
          <Calendar
            today={today}
            selectedDate={selectedDate}
            selectDate={selectDate}
          />
        </View>
        <GraphBySubject date={selectedDate} />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 12,
            backgroundColor: color.lightLightGray,
            marginBottom: 24,
            marginTop: 20,
          }}
        />
        <GraphByPeriod date={today} />
      </DiaryContainer>
    </SafeAreaView>
  );
};

export default Diary;
