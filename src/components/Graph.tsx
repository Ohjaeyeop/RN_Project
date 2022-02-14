import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {color, Theme} from '../theme/color';
import DateUtil from '../utils/DateUtil';
import getDisplayedTime from '../utils/getDisplayedTime';
import styled from 'styled-components/native';
import {StyledText} from './shared/StyledText';

const SubText = styled.Text`
  color: ${({theme}: {theme: Theme}) => theme.subText};
`;

const TimeBox = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.box2};
`;

const Line = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.box};
`;

const Graph = ({studyTimes}: {studyTimes: number[][]}) => {
  const graphHeight = 157;
  const [selectedIndex, setIndex] = useState(4);
  const maxValue = Math.max(
    1,
    ...studyTimes.map(times => Math.floor(times[2] / 60)),
  );

  const xAxisValue = (time: number[], index: number) => {
    if (studyTimes[0][0] === studyTimes[0][1]) {
      return `${DateUtil.getMonth(time[1])}.${DateUtil.getDate(time[1])}`;
    } else if (DateUtil.betweenDay(studyTimes[0][0], studyTimes[0][1]) === 6) {
      if (index === 4) {
        return '이번 주';
      }
      return `~${DateUtil.getMonth(time[1])}.${DateUtil.getDate(time[1])}`;
    } else {
      if (index === 4) {
        return '이번 달';
      }
      return `${DateUtil.getMonth(time[1])}월`;
    }
  };

  return (
    <View style={{width: '100%'}}>
      <SubText
        style={{
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 4,
        }}>
        기간별 공부 시간
      </SubText>
      {studyTimes[selectedIndex] && (
        <Text style={{color: color.gray, marginBottom: 48}}>
          {DateUtil.yearMonthDate(studyTimes[selectedIndex][0])}
          {studyTimes[selectedIndex][0] !== studyTimes[selectedIndex][1] &&
            ` ~ ${DateUtil.monthDate(studyTimes[selectedIndex][1])}`}
        </Text>
      )}
      {studyTimes[selectedIndex] ? (
        <>
          <View
            style={{
              paddingHorizontal: 24,
              height: graphHeight,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 50,
              alignItems: 'flex-end',
            }}>
            {[...new Array(3).keys()].map(i => (
              <Line
                key={i}
                style={[styles.line, {top: (graphHeight * i) / 2}]}
              />
            ))}
            {studyTimes.map((time, index) => (
              <Pressable
                style={[
                  styles.bar,
                  {
                    height: (graphHeight * Math.floor(time[2] / 60)) / maxValue,
                  },
                  {
                    backgroundColor:
                      index === selectedIndex ? color.primary : color.variant,
                  },
                ]}
                onPress={() => setIndex(index)}
                key={time[0]}>
                <Text
                  style={[
                    styles.value,
                    {
                      color:
                        index === selectedIndex ? color.primary : color.gray,
                    },
                  ]}>
                  {Math.floor(time[2] / 60)}
                </Text>
                <StyledText
                  style={[
                    styles.xValue,
                    {
                      top:
                        (graphHeight * Math.floor(time[2] / 60)) / maxValue -
                        10,
                    },
                  ]}>
                  {xAxisValue(time, index)}
                </StyledText>
              </Pressable>
            ))}
          </View>
          <TimeBox style={styles.timeBox}>
            <Image
              source={require('../../assets/book.png')}
              style={{width: 25, height: 28, marginRight: 10}}
            />
            <View>
              <SubText style={{fontSize: 12, height: 18}}>공부 시간</SubText>
              <StyledText style={{fontWeight: '700', height: 21}}>
                {getDisplayedTime(studyTimes[selectedIndex][2])}
              </StyledText>
            </View>
          </TimeBox>
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 1,
  },
  bar: {
    width: 48,
    bottom: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
  },
  value: {
    height: 18,
    top: -18,
    fontSize: 12,
    textAlign: 'center',
  },
  xValue: {
    height: 18,
    fontSize: 12,
    textAlign: 'center',
  },
  timeBox: {
    width: '100%',
    padding: 21,
    borderRadius: 10,
    marginBottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Graph;
