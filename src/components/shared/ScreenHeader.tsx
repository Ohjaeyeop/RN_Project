import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import React from 'react';

const Header = styled.View`
  width: 100%;
  height: 40px;
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
