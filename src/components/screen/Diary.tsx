import React from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import Calendar from '../Calendar';
import {View} from 'react-native';

const DiaryContainer = styled.View`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Diary = () => {
  return (
    <DiaryContainer>
      <ScreenHeader title={'캘린더'} />
      <View style={{paddingHorizontal: 20}}>
        <Calendar />
      </View>
    </DiaryContainer>
  );
};

export default Diary;
