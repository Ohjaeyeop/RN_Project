import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {color} from './theme/color';
import DateUtil from './utils/DateUtil';
import getDisplayedTime from './utils/getDisplayedTime';

const graphWidth = Dimensions.get('window').width - 40 - 48;
const graphHeight = 157;
const gap = (graphWidth - 48 * 5) / 4;

const Graph = ({studyTimes}: {studyTimes: number[][]}) => {
  const [selectedIndex, setIndex] = useState(4);
  const maxValue = Math.max(
    1,
    ...studyTimes.map(times => Math.floor(times[2] / 60)),
  );

  return (
    <View style={{width: '100%'}}>
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
          <View style={styles.graph}>
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
                    left: index * (48 + gap) + 24,
                  },
                  index === selectedIndex && {backgroundColor: color.primary},
                ]}
                onPress={() => setIndex(index)}>
                <Text
                  style={[
                    styles.value,
                    index === selectedIndex && {color: color.primary},
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
                  {`${DateUtil.getMonth(time[1])}.${DateUtil.getDate(time[1])}`}
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
  graph: {
    paddingHorizontal: 24,
    height: graphHeight,
    alignItems: 'center',
    marginBottom: 50,
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: color.lightGray,
  },
  bar: {
    width: 48,
    backgroundColor: color.variant,
    position: 'absolute',
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
    color: color.gray,
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
