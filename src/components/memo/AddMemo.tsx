import React, {useRef} from 'react';
import styled from 'styled-components/native';
import {Theme} from '../../theme/color';
import ScreenHeader from '../shared/ScreenHeader';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyledText} from '../shared/StyledText';
import {AddMemoProps} from '../../navigation/MemoStackNavigator';

const MemoContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const AddMemo = ({navigation}: AddMemoProps) => {
  const textInputRef = useRef<TextInput>(null);

  return (
    <MemoContainer>
      <ScreenHeader title="">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            paddingHorizontal: 15,
          }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.pop()}>
            <Icon name={'md-arrow-back-sharp'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => textInputRef.current?.blur()}>
            <StyledText style={{fontSize: 16}}>완료</StyledText>
          </TouchableOpacity>
        </View>
      </ScreenHeader>
      <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{flex: 1}}>
          <TextInput
            ref={textInputRef}
            autoFocus={true}
            style={{fontSize: 16, fontWeight: '700'}}
            multiline={true}
          />
        </View>
      </ScrollView>
    </MemoContainer>
  );
};

export default AddMemo;
