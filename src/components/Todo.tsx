import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {TodoObj} from './screen/Todos';
import {color} from '../theme/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Todo = ({
  toggleComplete,
  id,
  title,
  body,
  complete,
}: {
  toggleComplete: (id: string, complete: boolean) => Promise<void>;
} & TodoObj) => {
  return complete ? null : (
    <TouchableOpacity
      style={{
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: color.lightGray,
      }}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
        <Icon
          name="checkbox-blank-outline"
          size={20}
          color={color.gray}
          onPress={() => toggleComplete(id, complete)}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 11,
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          height: 40,
          backgroundColor: color.lightGray,
          padding: 8,
          justifyContent: 'center',
          borderRadius: 8,
        }}>
        <Text style={{color: color.navy, fontSize: 16}}>{body}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Todo;
