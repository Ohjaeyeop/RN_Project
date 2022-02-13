import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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
  setIdle,
  StudyInfo,
  updateStudyInfo,
} from '../../redux/studyInfoSlice';
import getDisplayedTime from '../../utils/getDisplayedTime';
import {useFocusEffect} from '@react-navigation/native';
import DateUtil from '../../utils/DateUtil';
import ScreenHeader from '../shared/ScreenHeader';
import styled from 'styled-components/native';

export type Subject = '국어' | '수학' | '영어' | '한국사' | '기타';

const subjects: Subject[] = ['국어', '수학', '영어', '한국사', '기타'];
const subjectColors = ['#D3165E', '#EF6825', '#FFC108', '#009148', '#00A4EC'];

const TimerContainer = styled.View`
  flex: 1;
  background-color: ${({theme}: {theme: Theme}) => theme.background};
`;

const StyledText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const StyledIcon = styled(Icon)`
  color: ${({theme}: {theme: Theme}) => theme.text};
`;

const StudyTimer = () => {
  const today = DateUtil.now();
  const {user} = useUser();
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [selectedDate, setSelectedDate] = useState(today);
  const dateRef = useRef(selectedDate);
  const [offset, setOffset] = useState(0);
  const handler = useRef(new TimeoutHandler()).current;
  const dispatch = useAppDispatch();

  const studyInfo = useAppSelector(selectStudyInfo);
  const studyInfoRef = useRef<StudyInfo>(studyInfo);
  const studyInfoStatus = useAppSelector(state => state.studyInfo.status);

  const startStudy = (subject: Subject) => {
    setSelectedSubject(subject);
    startTimer(subject);
  };

  const stopStudy = () => {
    setSelectedSubject(undefined);
  };

  useEffect(() => {
    user &&
      dispatch(getStudyInfo({username: user.username, date: today.toString()}));
  }, [dispatch, today, user]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopStudy();
        user &&
          dispatch(
            updateStudyInfo({
              username: user.username,
              date: today.toString(),
              studyInfo: studyInfoRef.current,
            }),
          );
        handler.clear();
      };
    }, [dispatch, handler, today, user]),
  );

  const changeDate = (change: number) => {
    if (selectedDate === today) {
      stopStudy();
      user &&
        dispatch(
          updateStudyInfo({
            username: user.username,
            date: today.toString(),
            studyInfo: studyInfoRef.current,
          }),
        );
    }
    const changedDate = DateUtil.dateFromNow(offset + change);
    user &&
      dispatch(
        getStudyInfo({username: user.username, date: changedDate.toString()}),
      );
    setOffset(offset + change);
    setSelectedDate(changedDate);
    dateRef.current = changedDate;
  };

  useEffect(() => {
    if (selectedDate === today) {
      studyInfoRef.current = studyInfo;
    }
  }, [selectedDate, studyInfo, today]);

  const startTimer = (subject: Subject) => {
    setIntervalWithTimeout(
      () => {
        dispatch(increment(subject));
      },
      1000,
      handler,
    );
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
      <View style={styles.displayedTime}>
        <StyledText style={{fontSize: 41, fontWeight: 'bold', lineHeight: 61}}>
          {getDisplayedTime(studyInfo.total)}
        </StyledText>
      </View>
      <View style={styles.subjectBox}>
        {subjects.map((subject, index) => (
          <View key={subject} style={styles.subjectLine}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: subjectColors[index],
                  marginRight: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handlePress(subject)}>
                <Icon
                  name={subject === selectedSubject ? 'pause' : 'play-arrow'}
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
  subjectBox: {
    borderTopWidth: 0.5,
    borderColor: color.gray,
    flex: 1,
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
