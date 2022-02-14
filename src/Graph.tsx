import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {color} from './theme/color';

const graphWidth = Dimensions.get('window').width - 40 - 48;
const graphHeight = 157;
const gap = (graphWidth - 48 * 5) / 4;

const Graph = ({studyTimes}: {studyTimes: number[][]}) => {
  const [selectedIndex, setIndex] = useState(4);
  const maxValue = Math.max(...studyTimes.map(times => times[2]));

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
          {studyTimes[selectedIndex][0]}
        </Text>
      )}
      {studyTimes[selectedIndex] ? (
        <View style={styles.graph}>
          {[...new Array(3).keys()].map(i => (
            <View key={i} style={[styles.line, {top: (graphHeight * i) / 2}]} />
          ))}
          {studyTimes.map((time, index) => (
            <Pressable
              style={[
                styles.bar,
                {
                  height: (graphHeight * time[2]) / maxValue,
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
                {time[2]}
              </Text>
              <Text
                style={[
                  styles.xValue,
                  {top: (graphHeight * time[2]) / maxValue},
                ]}>
                {time[1] % 100}
              </Text>
            </Pressable>
          ))}
        </View>
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
    width: 20,
    height: 18,
    top: -18,
    fontSize: 12,
    color: color.gray,
    textAlign: 'center',
  },
  xValue: {
    width: 17,
    height: 18,
    color: color.subDark,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Graph;
