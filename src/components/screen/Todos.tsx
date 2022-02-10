import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import {color} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../providers/UserProvider';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modalbox';
import Button from '../shared/Button';
import Todo from '../Todo';

export type TodoObj = {
  id: string;
  title: string;
  body: string;
  complete: boolean;
};

const Todos = () => {
  const {user} = useUser();
  const todosRef = firestore()
    .collection('Todo')
    .doc(user?.username)
    .collection('todos');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [todos, setTodos] = useState<TodoObj[]>([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<Modal>(null);

  async function addTodo() {
    await todosRef.add({title, body, complete: false});
    setTitle('');
    setBody('');
  }

  async function toggleComplete(id: string, complete: boolean) {
    await todosRef.doc(id).update({complete: !complete});
  }

  useEffect(() => {
    return todosRef.onSnapshot(querySnapshot => {
      const list: TodoObj[] = [];
      querySnapshot.forEach(doc => {
        const {title, body, complete} = doc.data();
        list.push({id: doc.id, title, body, complete});
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    });
  }, [loading, todosRef]);

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
      <FlatList
        data={todos}
        renderItem={({item}) => (
          <Todo toggleComplete={toggleComplete} {...item} />
        )}
        keyExtractor={todo => todo.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => modalRef.current?.open()}>
        <Icon name="add" color={color.white} size={25} />
      </TouchableOpacity>
      <Modal
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        coverScreen={true}
        backdropOpacity={0.5}
        ref={modalRef}
        style={styles.modal}>
        <View>
          <Text
            style={{
              color: color.dark,
              fontSize: 16,
              fontWeight: '700',
              marginBottom: 16,
            }}>
            TODO에 할 일을 추가합니다.
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="제목을 적어주세요"
            placeholderTextColor={color.dark}
            value={title}
            onChangeText={setTitle}
            style={{
              fontSize: 16,
              fontWeight: '700',
              paddingHorizontal: 5,
              marginBottom: 10,
            }}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="할 일을 적어주세요"
            placeholderTextColor={color.gray}
            value={body}
            onChangeText={setBody}
            style={{
              backgroundColor: color.lightGray,
              padding: 8,
              fontSize: 16,
              borderRadius: 5,
              marginBottom: 20,
            }}
          />
          <Button
            text="저장하기"
            onPress={() => {
              addTodo();
              modalRef.current?.close();
            }}
          />
        </View>
      </Modal>
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
  modal: {
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});

export default Todos;
