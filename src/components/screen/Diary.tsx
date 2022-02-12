import React from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import Calendar from '../Calendar';

const DiaryContainer = styled.View`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Diary = () => {
  return (
    <DiaryContainer>
      <ScreenHeader title={'캘린더'} />
      <Calendar />
    </DiaryContainer>
  );
};

export default Diary;
