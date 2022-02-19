import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {TodoObj} from '../screen/Todos';
import {color, Theme} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledText} from '../shared/StyledText';
import styled from 'styled-components/native';

type Props = {
  toggleComplete: (id: string, complete: boolean) => Promise<void>;
  onPress: (id: string, title: string, body: string) => void;
} & {type: 'TODO' | 'DONE'} & TodoObj;

const StyledBox = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.box};
`;

const Todo = ({
  toggleComplete,
  type,
  id,
  title,
  body,
  complete,
  onPress,
}: Props) => {
  return (type === 'TODO' && complete) ||
    (type === 'DONE' && !complete) ? null : (
    <TouchableOpacity
      style={{
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: color.lightGray,
      }}
      onPress={() => onPress(id, title, body)}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
        <Icon
          name={type === 'TODO' ? 'checkbox-blank-outline' : 'checkbox-marked'}
          size={20}
          color={color.gray}
          onPress={() => toggleComplete(id, complete)}
        />
        <StyledText
          style={{
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 11,
            textDecorationLine: type === 'DONE' ? 'line-through' : undefined,
          }}>
          {title}
        </StyledText>
      </View>
      <StyledBox
        style={{
          height: 40,
          padding: 8,
          justifyContent: 'center',
          borderRadius: 8,
        }}>
        <StyledText style={{fontSize: 16}}>{body}</StyledText>
      </StyledBox>
    </TouchableOpacity>
  );
};

export default Todo;
