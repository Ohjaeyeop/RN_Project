import {Keyboard, KeyboardEvent, useWindowDimensions} from 'react-native';
import {useEffect, useState} from 'react';

export default function useIsFloatingKeyboard() {
  const screenWidth = useWindowDimensions().width;

  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onKeyboardWillChangeFrame = (event: KeyboardEvent) => {
      setFloating(event.endCoordinates.width !== screenWidth);
    };

    const subscription = Keyboard.addListener(
      'keyboardWillChangeFrame',
      onKeyboardWillChangeFrame,
    );
    return () => {
      subscription.remove();
    };
  }, [screenWidth]);

  return floating;
}
