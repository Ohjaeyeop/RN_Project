import React, {useRef} from 'react';
import {
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';
import {color, Theme} from '../../theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import useIsFloatingKeyboard from '../../hooks/useIsFloatingKeyboard';

const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
  font-size: 16px;
`;

const ModalView = styled(Pressable)`
  background-color: ${({theme}: {theme: Theme}) => theme.modal};
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
  const {width} = useWindowDimensions();
  const safeArea = useSafeAreaInsets();
  const inputRef = useRef<TextInput | null>(null);
  const floating = useIsFloatingKeyboard();

  return (
    <Modal
      animationIn="slideInUp"
      animationInTiming={100}
      isVisible={visible}
      backdropColor="rgba(33, 37, 41, 0.5)"
      onBackButtonPress={() => closeModal()}
      onBackdropPress={() => closeModal()}
      avoidKeyboard={!floating}
      swipeDirection="down"
      onSwipeComplete={() => closeModal()}
      supportedOrientations={['portrait', 'landscape']}
      onModalShow={() => {
        inputRef.current?.focus();
      }}
      onModalWillHide={() => {
        inputRef.current?.blur();
      }}
      style={{alignItems: 'center', justifyContent: 'flex-end', margin: 0}}>
      <ModalView
        style={{
          width: width,
          paddingHorizontal: 20 + safeArea.left,
          paddingTop: 24,
        }}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <StyledText
            style={{
              fontWeight: '700',
              marginBottom: 16,
            }}>
            TODO에 할 일을 추가합니다.
          </StyledText>
          <TodoTitleInput
            ref={ref => (inputRef.current = ref)}
            autoCapitalize="none"
            placeholder="제목을 적어주세요"
            value={title}
            onChangeText={setTitle}
            autoCorrect={false}
          />
          <TodoBodyInput
            autoCapitalize="none"
            placeholder="할 일을 적어주세요"
            value={body}
            onChangeText={setBody}
            autoCorrect={false}
            multiline={true}
          />
          {children}
        </ScrollView>
      </ModalView>
    </Modal>
  );
};

export default TodoModal;
