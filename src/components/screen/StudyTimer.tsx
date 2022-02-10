import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../providers/UserProvider';
import setIntervalWithTimeout, {
  TimeoutHandler,
} from '../../utils/setIntervalWithTimeout';
import {useAppDispatch, useAppSelector} from '../../hooks/useReduxFunction';
import {increment, selectStudyInfo} from '../../redux/studyInfoSlice';

export type Subject = '국어' | '수학' | '영어' | '한국사' | '기타';

const days = ['일', '월', '화', '수', '목', '금', '토'];
const subjects: Subject[] = ['국어', '수학', '영어', '한국사', '기타'];
const subjectColors = ['#D3165E', '#EF6825', '#FFC108', '#009148', '#00A4EC'];

const StudyTimer = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  const day = days[new Date().getDay()];
  const {user} = useUser();

  const [isStudying, setIsStudying] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const handler = useRef(new TimeoutHandler()).current;
  const studyInfo = useAppSelector(selectStudyInfo);
  const dispatch = useAppDispatch();

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
    if (subject === selectedSubject) {
      handler.clear();
      setSelectedSubject(undefined);
      setIsStudying(!isStudying);
    } else {
      setSelectedSubject(subject);
      setIsStudying(true);
      handler.clear();
      startTimer(subject);
    }
  };

  return (
    <View style={styles.timerContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name={'arrow-left'} size={20} />
        <Text
          style={[
            styles.text,
            {fontSize: 16, marginHorizontal: 17},
          ]}>{`${month}.${date}.(${day})`}</Text>
        <Icon name={'arrow-right'} size={20} />
      </View>
      <View style={styles.displayedTime}>
        <Text
          style={[
            styles.text,
            {fontSize: 41, fontWeight: 'bold', lineHeight: 61},
          ]}>
          {studyInfo.total}
        </Text>
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
              <Text style={[styles.text, {fontSize: 15}]}>{subject}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
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
    borderBottomWidth: 1,
    borderColor: color.lightGray,
    padding: 20,
  },
});

export default StudyTimer;
