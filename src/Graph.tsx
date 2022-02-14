import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {color} from './theme/color';
import DateUtil from './utils/DateUtil';
import getDisplayedTime from './utils/getDisplayedTime';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Graph = ({studyTimes}: {studyTimes: number[][]}) => {
  const [graphWidth, setGraphWidth] = useState(0);
  const graphHeight = 157;
  const gap = Math.floor((graphWidth - 48 * 5) / 4);
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
    <View
      style={{width: '100%'}}
      onLayout={event => setGraphWidth(event.nativeEvent.layout.width)}>
      <Text
        style={{
          color: color.navy,
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 4,
        }}>
        기간별 공부 시간
      </Text>
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
              <View
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
                <Text
                  style={[
                    styles.xValue,
                    {
                      top:
                        (graphHeight * Math.floor(time[2] / 60)) / maxValue -
                        10,
                    },
                  ]}>
                  {xAxisValue(time, index)}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.timeBox}>
            <Image
              source={require('../assets/book.png')}
              style={{width: 25, height: 28, marginRight: 10}}
            />
            <View>
              <Text style={{color: color.navy, fontSize: 12, height: 18}}>
                공부 시간
              </Text>
              <Text style={{color: color.dark, fontWeight: '700', height: 21}}>
                {getDisplayedTime(studyTimes[selectedIndex][2])}
              </Text>
            </View>
          </View>
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
    backgroundColor: color.lightGray,
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
    color: color.subDark,
    fontSize: 12,
    textAlign: 'center',
  },
  timeBox: {
    width: '100%',
    backgroundColor: color.lightLightGray,
    padding: 21,
    borderRadius: 10,
    marginBottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Graph;
