import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {color, Theme} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../providers/UserProvider';
import setIntervalWithTimeout, {
  TimeoutHandler,
} from '../../utils/setIntervalWithTimeout';
import {useAppDispatch, useAppSelector} from '../../hooks/useReduxFunction';
import {
  getStudyInfo,
  increment,
  selectStudyInfo,
  updateStudyInfo,
} from '../../redux/studyInfoSlice';
import getDisplayedTime from '../../utils/getDisplayedTime';
import {useFocusEffect} from '@react-navigation/native';
import DateUtil from '../../utils/DateUtil';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';
import {Subject, subjectColors, subjects} from '../../data/study';
import {StyledText} from '../shared/StyledText';

const TimerContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const StyledIcon = styled(Icon)`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const StudyTimer = () => {
  const today = DateUtil.now();
  const {user} = useUser();
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [selectedDate, setSelectedDate] = useState(today);
  const [offset, setOffset] = useState(0);
  const handler = useRef(new TimeoutHandler()).current;
  const dispatch = useAppDispatch();
  const callRef = useRef<() => void>();
  callRef.current = () => {
    user &&
      selectedDate === today &&
      dispatch(
        updateStudyInfo({
          username: user.username,
          date: today,
          studyInfo: studyInfo,
        }),
      );
  };

  const studyInfo = useAppSelector(selectStudyInfo);

  const updateInfo = () => {
    callRef.current?.();
  };

  const startStudy = (subject: Subject) => {
    startTimer(subject);
    setSelectedSubject(subject);
  };

  const stopStudy = useCallback(() => {
    handler.clear();
    setSelectedSubject(undefined);
  }, [handler]);

  const startTimer = (subject: Subject) => {
    setIntervalWithTimeout(
      sec => {
        dispatch(increment({subject, sec}));
      },
      999,
      handler,
    );
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedDate(today);
      setOffset(0);
      user && dispatch(getStudyInfo({username: user.username, date: today}));
    }, [dispatch, today, user]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopStudy();
        updateInfo();
        handler.clear();
      };
    }, [handler, stopStudy]),
  );

  const changeDate = (change: number) => {
    if (selectedDate === today) {
      handler.clear();
      stopStudy();
      updateInfo();
    }
    const changedDate = DateUtil.dateFromNow(offset + change);
    setOffset(offset + change);
    setSelectedDate(changedDate);
    user &&
      dispatch(getStudyInfo({username: user.username, date: changedDate}));
  };

  const handlePress = (subject: Subject) => {
    if (selectedDate !== today) {
      return;
    }

    handler.clear();
    if (subject === selectedSubject) {
      stopStudy();
    } else {
      startStudy(subject);
    }
  };

  return (
    <TimerContainer>
      <ScreenHeader title={'타이머'} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <StyledIcon
          name={'arrow-left'}
          size={20}
          onPress={() => changeDate(-1)}
        />
        <StyledText style={{fontSize: 16, marginHorizontal: 17}}>
          {DateUtil.monthDateDay(selectedDate)}
        </StyledText>
        <StyledIcon
          name={'arrow-right'}
          size={20}
          onPress={selectedDate !== today ? () => changeDate(1) : undefined}
        />
      </View>
      {studyInfo.date === selectedDate ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View style={[styles.displayedTime]}>
            <StyledText
              style={{fontSize: 41, fontWeight: 'bold', lineHeight: 61}}>
              {getDisplayedTime(studyInfo.total)}
            </StyledText>
          </View>
          <View style={{}}>
            {subjects.map(subject => (
              <View key={subject} style={styles.subjectLine}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: subjectColors[subject],
                      marginRight: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handlePress(subject)}>
                    <Icon
                      name={
                        subject === selectedSubject ? 'pause' : 'play-arrow'
                      }
                      color={color.white}
                      size={20}
                    />
                  </TouchableOpacity>
                  <StyledText style={{fontSize: 15}}>{subject}</StyledText>
                </View>
                <StyledText style={{fontSize: 15}}>
                  {getDisplayedTime(studyInfo[subject])}
                </StyledText>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={color.primary} />
        </View>
      )}
    </TimerContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    color: color.dark,
  },
  displayedTime: {
    alignItems: 'center',
    marginVertical: 12,
  },
  subjectLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color.lightGray,
    padding: 20,
  },
});

export default StudyTimer;
