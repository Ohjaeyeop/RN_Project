import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Header = styled.View`
  width: 100%;
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
  const safeArea = useSafeAreaInsets();

  return (
    <Header style={{height: 80 - safeArea.top}}>
      <Title>{title}</Title>
    </Header>
  );
};

export default ScreenHeader;
