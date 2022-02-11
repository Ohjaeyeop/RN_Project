import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Dimensions,
  FlatList,
} from 'react-native';
import {color, Theme} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../providers/UserProvider';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modalbox';
import Button from '../shared/Button';
import Todo from '../Todo';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';

export type TodoObj = {
  id: string;
  title: string;
  body: string;
  complete: boolean;
};

const TodoContainer = styled.View`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
  font-size: 16px;
`;

const TodoMoal = styled(Modal)`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  height: ${Dimensions.get('window').height * 0.6}px;
  border-radius: 10px;
  padding: 20px 24px;
`;

const TodoTitleInput = styled.TextInput.attrs(({theme}: {theme: Theme}) => ({
  placeholderTextColor: theme.text,
}))`
  font-size: 16px;
  font-weight: 700;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 10px;
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const TodoBodyInput = styled.TextInput.attrs(() => ({
  placeholderTextColor: color.gray,
}))`
  background-color: ${({theme}: {theme: Theme}) => theme.box};
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  margin-bottom: 20px;
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

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
  const [displayedTodoType, setDisplayedTodoType] = useState<'TODO' | 'DONE'>(
    'TODO',
  );
  const modalRef = useRef<Modal>(null);

  async function addTodo() {
    await todosRef.add({title, body, complete: false});
    setTitle('');
    setBody('');
  }

  async function editTodo(id: string, title: string, body: string) {
    await todosRef.doc(id).update({title, body});
  }

  async function deleteTodo(id: string) {
    await todosRef.doc(id).delete();
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
    <TodoContainer>
      <ScreenHeader title={'투두'} />
      <View style={styles.selectView}>
        <Pressable
          style={[
            styles.touchableView,
            {
              borderColor:
                displayedTodoType === 'TODO' ? color.primary : color.lightGray,
            },
          ]}
          onPress={() => setDisplayedTodoType('TODO')}>
          <StyledText
            style={
              displayedTodoType !== 'TODO' ? {color: color.gray} : undefined
            }>
            TODO
          </StyledText>
        </Pressable>
        <Pressable
          style={[
            styles.touchableView,
            {
              borderColor:
                displayedTodoType === 'DONE' ? color.primary : color.lightGray,
            },
          ]}
          onPress={() => setDisplayedTodoType('DONE')}>
          <StyledText
            style={
              displayedTodoType !== 'DONE' ? {color: color.gray} : undefined
            }>
            DONE
          </StyledText>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={({item}) => (
          <Todo
            toggleComplete={toggleComplete}
            type={displayedTodoType}
            {...item}
          />
        )}
        keyExtractor={todo => todo.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => modalRef.current?.open()}>
        <Icon name="add" color={color.white} size={25} />
      </TouchableOpacity>
      <TodoMoal
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        coverScreen={true}
        backdropOpacity={0.5}
        ref={modalRef}
        style={styles.modal}>
        <View>
          <StyledText
            style={{
              fontWeight: '700',
              marginBottom: 16,
            }}>
            TODO에 할 일을 추가합니다.
          </StyledText>
          <TodoTitleInput
            autoCapitalize="none"
            placeholder="제목을 적어주세요"
            value={title}
            onChangeText={setTitle}
          />
          <TodoBodyInput
            autoCapitalize="none"
            placeholder="할 일을 적어주세요"
            value={body}
            onChangeText={setBody}
          />
          <Button
            text="저장하기"
            onPress={() => {
              addTodo();
              modalRef.current?.close();
            }}
          />
        </View>
      </TodoMoal>
    </TodoContainer>
  );
};

const styles = StyleSheet.create({
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
  modal: {
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});

export default Todos;
