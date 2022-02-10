import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  Pressable,
} from 'react-native';
import {color} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Todo = () => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.selectView}>
        <Pressable style={styles.touchableView}>
          <Text style={styles.selectText}>TODO</Text>
        </Pressable>
        <Pressable style={styles.touchableView}>
          <Text style={styles.selectText}>DONE</Text>
        </Pressable>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Icon name="add" color={color.white} size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: color.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectView: {
    flexDirection: 'row',
  },
  touchableView: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: color.lightGray,
    height: 56,
    paddingTop: 24,
  },
  selectText: {
    fontSize: 16,
    color: color.dark,
  },
});

export default Todo;
