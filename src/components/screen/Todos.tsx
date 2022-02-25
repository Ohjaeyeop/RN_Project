import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
} from 'react-native';
import {color, Theme} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../providers/UserProvider';
import firestore from '@react-native-firebase/firestore';
import Button from '../shared/Button';
import Todo from '../todo/Todo';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import TodoModal from '../shared/TodoModal';
import {StyledText} from '../shared/StyledText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type TodoObj = {
  id: string;
  title: string;
  body: string;
  complete: boolean;
};

const TodoContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const Todos = () => {
  const {user} = useUser();
  const safeArea = useSafeAreaInsets();
  const todosRef = useMemo(
    () =>
      firestore().collection('Todo').doc(user?.username).collection('todos'),
    [user?.username],
  );
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [id, setId] = useState('');
  const [todos, setTodos] = useState<TodoObj[]>([]);
  const [displayedTodoType, setDisplayedTodoType] = useState<'TODO' | 'DONE'>(
    'TODO',
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const closeAddModal = () => {
    setAddModalVisible(false);
  };
  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const cleanTodo = () => {
    setTitle('');
    setBody('');
  };

  async function addTodo() {
    await todosRef.add({title, body, complete: false});
    cleanTodo();
  }

  async function editTodo() {
    await todosRef.doc(id).update({title, body});
    cleanTodo();
  }

  async function deleteTodo() {
    await todosRef.doc(id).delete();
    cleanTodo();
  }

  async function toggleComplete(id: string, complete: boolean) {
    await todosRef.doc(id).update({complete: !complete});
  }

  const handleTodoPress = (id: string, title: string, body: string) => {
    setTitle(title);
    setBody(body);
    setId(id);
    setEditModalVisible(true);
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
        style={[styles.addButton, {right: 20 + safeArea.right}]}
        onPress={() => {
          cleanTodo();
          setAddModalVisible(true);
        }}>
        <Icon name="add" color={color.white} size={25} />
      </TouchableOpacity>
      <TodoModal
        title={title}
        body={body}
        setTitle={setTitle}
        setBody={setBody}
        visible={addModalVisible}
        closeModal={closeAddModal}>
        <Button
          text="저장하기"
          style={{
            backgroundColor: color.primary,
            width: '100%',
            padding: 18,
            marginVertical: 16,
          }}
          textColor={color.white}
          fontSize={18}
          onPress={() => {
            addTodo();
            closeAddModal();
          }}
        />
      </TodoModal>
      <TodoModal
        title={title}
        body={body}
        setTitle={setTitle}
        setBody={setBody}
        visible={editModalVisible}
        closeModal={closeEditModal}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            text="삭제하기"
            style={{
              backgroundColor: color.lightGray,
              width: '48%',
              padding: 18,
              marginVertical: 16,
            }}
            textColor={color.gray}
            fontSize={18}
            onPress={() => {
              deleteTodo();
              closeEditModal();
            }}
          />
          <Button
            text="저장하기"
            style={{
              backgroundColor: color.primary,
              width: '48%',
              padding: 18,
              marginVertical: 16,
            }}
            textColor={color.white}
            fontSize={18}
            onPress={() => {
              editTodo();
              closeEditModal();
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
