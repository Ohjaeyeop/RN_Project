import React, {useImperativeHandle, useRef, useState} from 'react';
import {Dimensions, View} from 'react-native';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import Modal from 'react-native-modalbox';

const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
  font-size: 16px;
`;

const StyledModal = styled(Modal)`
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

type Props = {
  title: string;
  body: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setBody: React.Dispatch<React.SetStateAction<string>>;
};

export type TodoModalRef = {
  openModal: () => void;
  closeModal: () => void;
};

const TodoModal = React.forwardRef<
  TodoModalRef,
  React.PropsWithChildren<Props>
>((props, ref) => {
  const {title, body, setTitle, setBody} = props;
  const modalRef = useRef<Modal>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      modalRef.current?.open();
    },
    closeModal: () => {
      modalRef.current?.close();
    },
  }));

  return (
    <StyledModal
      entry="bottom"
      position="bottom"
      swipeToClose={false}
      coverScreen={true}
      backdropOpacity={0.5}
      ref={modalRef}>
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
        {props.children}
      </View>
    </StyledModal>
  );
});

export default TodoModal;
