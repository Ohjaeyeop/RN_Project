import React, {useCallback, useState} from 'react';
import {Pressable, View, Text, StyleSheet} from 'react-native';
import {useUser} from '../providers/UserProvider';
import DateUtil from '../utils/DateUtil';
import {color, Theme} from '../theme/color';
import Graph from './Graph';
import {useFocusEffect} from '@react-navigation/native';
import styled from 'styled-components/native';
import {getStudyInfoByPeriod, getUserRef} from '../redux/studyInfoSlice';

const SelectBox = styled.View`
  background-color: ${({theme}: {theme: Theme}) => theme.box2};
`;

const GraphByPeriod = ({date}: {date: number}) => {
  const day = DateUtil.getDay(date) > 0 ? DateUtil.getDay(date) : 7;
  const {user} = useUser();
  const [period, setPeriod] = useState<'일간' | '주간' | '월간'>('일간');
  const [studyTimes, setStudyTimes] = useState<number[][]>([[]]);

  const getStudyTime = useCallback(
    async (start: number, end: number) => {
      if (!user) {
        return 0;
      }
      let total = 0;
      await getStudyInfoByPeriod(user.username, start, end).then(
        querySnapshot => {
          if (querySnapshot.size > 0) {
            total += querySnapshot.docs[0].data().total;
          }
        },
      );
      return total;
    },
    [user],
  );

  const getRange = useCallback(
    (offset, period) => {
      if (period === '일간') {
        return {
          start: DateUtil.dateFromNow(offset),
          end: DateUtil.dateFromNow(offset),
        };
      } else if (period === '주간') {
        return {
          start: DateUtil.dateFromNow(1 - day + 7 * offset),
          end:
            offset === 0
              ? date
              : DateUtil.dateFromNow(1 - day + 7 * offset + 6),
        };
      } else {
        const d = DateUtil.dateFromNowByMonth(offset);
        return {
          start: Math.floor(d / 100) * 100 + 1,
          end: offset === 0 ? date : DateUtil.getLastDate(d),
        };
      }
    },
    [date, day],
  );

  const getData = useCallback(
    async period => {
      let data: number[][] = [];
      for (let i = -4; i <= 0; i++) {
        const {start, end} = getRange(i, period);
        const total = await getStudyTime(start, end);
        data.push([start, end, total]);
      }
      setStudyTimes(data);
    },
    [getRange, getStudyTime],
  );

  useFocusEffect(
    useCallback(() => {
      getData(period);
    }, [getData, period]),
  );

  return (
    <View style={{paddingHorizontal: 20, alignItems: 'center'}}>
      <SelectBox
        style={{
          borderRadius: 40,
          width: 'auto',
          flexDirection: 'row',
          marginBottom: 24,
        }}>
        <Pressable
          style={[
            styles.pressable,
            period === '일간' && {backgroundColor: color.variant},
          ]}
          onPress={() => setPeriod('일간')}>
          <Text
            style={[
              styles.periodType,
              period === '일간' && {color: color.primary},
            ]}>
            일간
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.pressable,
            period === '주간' && {backgroundColor: color.variant},
          ]}
          onPress={() => setPeriod('주간')}>
          <Text
            style={[
              styles.periodType,
              period === '주간' && {color: color.primary},
            ]}>
            주간
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.pressable,
            period === '월간' && {backgroundColor: color.variant},
          ]}
          onPress={() => setPeriod('월간')}>
          <Text
            style={[
              styles.periodType,
              period === '월간' && {color: color.primary},
            ]}>
            월간
          </Text>
        </Pressable>
      </SelectBox>
      <Graph studyTimes={studyTimes} />
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
  },
  periodType: {
    fontSize: 12,
    fontWeight: '700',
    color: color.gray,
  },
});

export default GraphByPeriod;
