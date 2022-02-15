import React from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {ScrollView, TouchableOpacity, Text} from 'react-native';

const MemoContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Memo = () => {
  return (
    <MemoContainer>
      <ScreenHeader title={'메모'}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 20,
            bottom: 8,
          }}>
          <Text style={{color: color.primary}}>메모 작성</Text>
        </TouchableOpacity>
      </ScreenHeader>
      <ScrollView></ScrollView>
    </MemoContainer>
  );
};

export default Memo;
