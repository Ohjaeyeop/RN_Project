import styled from 'styled-components/native';
import {Theme} from '../../theme/color';

export const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;
