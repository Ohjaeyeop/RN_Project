import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';

type Props = {
  text: string;
  textColor: string;
  fontSize: number;
  onPress: () => void;
  style: ViewStyle;
};

const Button = ({text, textColor, fontSize, onPress, style}: Props) => {
  return (
    <TouchableOpacity
      testID={'button'}
      style={[styles.button, {...style}]}
      onPress={onPress}>
      <Text style={{color: textColor, fontSize, fontWeight: '700'}}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;
