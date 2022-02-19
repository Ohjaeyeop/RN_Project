import React from 'react';
import {ScrollView, useWindowDimensions, Pressable} from 'react-native';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
  font-size: 16px;
`;

const ModalView = styled(Pressable)`
  background-color: ${({theme}: {theme: Theme}) => theme.background};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
  visible: boolean;
  children: JSX.Element;
  closeModal: () => void;
};

const TodoModal = ({
  title,
  body,
  setTitle,
  setBody,
  visible,
  closeModal,
  children,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const safeArea = useSafeAreaInsets();

  return (
    <Modal
      animationIn="slideInUp"
      isVisible={visible}
      backdropColor="rgba(33, 37, 41, 0.5)"
      onBackButtonPress={() => closeModal()}
      onBackdropPress={() => closeModal()}
      avoidKeyboard={true}
      swipeDirection="down"
      onSwipeComplete={() => closeModal()}
      supportedOrientations={['portrait', 'landscape']}
      useNativeDriver={true}
      style={{alignItems: 'center', justifyContent: 'flex-end', margin: 0}}>
      <ModalView
        style={{
          width: width,
          paddingHorizontal: 20 + safeArea.left,
          paddingVertical: 24,
        }}>
        <ScrollView>
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
            autoCorrect={false}
            autoFocus={true}
          />
          <TodoBodyInput
            autoCapitalize="none"
            placeholder="할 일을 적어주세요"
            value={body}
            onChangeText={setBody}
            autoCorrect={false}
          />
        </ScrollView>
        {children}
      </ModalView>
    </Modal>
  );
};

export default TodoModal;
