import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import Button from './Button';

it('버튼을 누르면 onPress가 실행된다', () => {
  const onPress = jest.fn();
  const {getByTestId} = render(
    <Button
      style={{backgroundColor: 'black'}}
      text={'Button'}
      textColor={'white'}
      fontSize={14}
      onPress={onPress}
    />,
  );

  const button = getByTestId('button');
  fireEvent.press(button);
  expect(onPress).toHaveBeenCalledTimes(1);
});
