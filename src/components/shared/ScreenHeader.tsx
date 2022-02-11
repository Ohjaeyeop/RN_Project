import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import React from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const statusBarHeight = getStatusBarHeight(true);

const Header = styled.SafeAreaView`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  width: 100%;
  height: ${statusBarHeight + 40}px;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
  font-size: 16px;
  position: absolute;
  bottom: 8px;
`;

const ScreenHeader = ({title}: {title: string}) => {
  return (
    <Header>
      <Title>{title}</Title>
    </Header>
  );
};

export default ScreenHeader;
