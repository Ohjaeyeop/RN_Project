import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type Props = {
  text: string;
  backgroundColor: string;
  textColor: string;
  width: string;
  onPress: () => void;
};

const Button = ({text, backgroundColor, textColor, width, onPress}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: backgroundColor, width: width}]}
      onPress={onPress}>
      <Text style={{color: textColor, fontSize: 18, fontWeight: '700'}}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
});

export default Button;
