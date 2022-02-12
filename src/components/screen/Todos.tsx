import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import TodoModal, {TodoModalRef} from '../shared/TodoModal';

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

const Todos = () => {
  const {user} = useUser();
  const todosRef = useMemo(
    () =>
      firestore().collection('Todo').doc(user?.username).collection('todos'),
    [user?.username],
  );
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [todos, setTodos] = useState<TodoObj[]>([]);
  const [displayedTodoType, setDisplayedTodoType] = useState<'TODO' | 'DONE'>(
    'TODO',
  );
  const addTodoModalRef = useRef<TodoModalRef>(null);
  const editTodoModalRef = useRef<TodoModalRef>(null);

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

  const handleTodoPress = (id: string, title: string, body: string) => {
    setTitle(title);
    setBody(body);
    editTodoModalRef.current?.openModal();
  };

  useEffect(() => {
    const subscriber = todosRef.onSnapshot(querySnapshot => {
      const list: TodoObj[] = [];
      querySnapshot?.forEach(doc => {
        const {title, body, complete} = doc.data();
        list.push({id: doc.id, title, body, complete});
      });
      setTodos(list);
    });

    return () => subscriber();
  }, [todosRef]);

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
            onPress={handleTodoPress}
            {...item}
          />
        )}
        keyExtractor={todo => todo.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addTodoModalRef.current?.openModal()}>
        <Icon name="add" color={color.white} size={25} />
      </TouchableOpacity>
      <TodoModal
        title={title}
        body={body}
        setTitle={setTitle}
        setBody={setBody}
        ref={addTodoModalRef}>
        <Button
          text="저장하기"
          backgroundColor={color.primary}
          textColor={color.white}
          width="100%"
          onPress={() => {
            addTodo();
            addTodoModalRef.current?.closeModal();
          }}
        />
      </TodoModal>
      <TodoModal
        title={title}
        body={body}
        setTitle={setTitle}
        setBody={setBody}
        ref={editTodoModalRef}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            text="삭제하기"
            backgroundColor={color.lightGray}
            textColor={color.gray}
            width="48%"
            onPress={() => {
              editTodoModalRef.current?.closeModal();
            }}
          />
          <Button
            text="저장하기"
            backgroundColor={color.primary}
            textColor={color.white}
            width="48%"
            onPress={() => {
              editTodoModalRef.current?.closeModal();
            }}
          />
        </View>
      </TodoModal>
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
});

export default Todos;
