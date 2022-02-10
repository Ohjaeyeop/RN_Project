import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {color} from '../../theme/color';

const Button = ({text}: {text: string}) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={{color: color.white, fontSize: 18, fontWeight: '700'}}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: color.primary,
    borderRadius: 30,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
});

export default Button;
