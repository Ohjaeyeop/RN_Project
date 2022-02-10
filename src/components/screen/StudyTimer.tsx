import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../../theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUser} from '../../providers/UserProvider';

const days = ['일', '월', '화', '수', '목', '금', '토'];
const subjects = ['국어', '수학', '영어', '한국사', '기타'];
const subjectColors = ['#D3165E', '#EF6825', '#FFC108', '#009148', '#00A4EC'];

class TimeoutHandler {
  private handlerRef: {id: any} = {id: -1};

  get handler(): any {
    return this.handlerRef.id;
  }
  set handler(n: any) {
    this.handlerRef.id = n;
  }

  clear() {
    clearTimeout(this.handlerRef.id as any);
  }
}

function setIntervalWithTimeout(
  callback: (clear: () => void) => any,
  intervalMs: number,
  handleWrapper = new TimeoutHandler(),
): TimeoutHandler {
  let cleared = false;

  const timeout = () => {
    handleWrapper.handler = setTimeout(() => {
      callback(() => {
        cleared = true;
        handleWrapper.clear();
      });
      if (!cleared) {
        timeout();
      }
    }, intervalMs);
  };
  timeout();
  return handleWrapper;
}

const StudyTimer = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  const day = days[new Date().getDay()];
  const {user} = useUser();

  setIntervalWithTimeout(clear => {
    /* 과목 공부시간 1초 증가, 합계 시간 1초 증가, 일시 정지 시 clear */
  }, 1000);

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
          00:00:00
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
                }}>
                <Icon name="play-arrow" color={color.white} size={20} />
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
