import React from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';

const MemoContainer = styled.View`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Memo = () => {
  return (
    <MemoContainer>
      <ScreenHeader title={'메모'} />
    </MemoContainer>
  );
};

export default Memo;
