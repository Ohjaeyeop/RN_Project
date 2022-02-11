import React from 'react';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';

const SettingContainer = styled.View`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Setting = () => {
  return (
    <SettingContainer>
      <ScreenHeader title={'설정'} />
    </SettingContainer>
  );
};

export default Setting;
