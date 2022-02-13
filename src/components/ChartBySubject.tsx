import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useUser} from '../providers/UserProvider';
import {useAppDispatch, useAppSelector} from '../hooks/useReduxFunction';
import {getStudyInfo, selectStudyInfo} from '../redux/studyInfoSlice';
import {subjectColors, subjects} from '../data/study';
import getDisplayedTime from '../utils/getDisplayedTime';
import {color} from '../theme/color';

const ChartBySubject = ({date}: {date: number}) => {
  const {user} = useUser();
  const studyInfo = useAppSelector(selectStudyInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    user &&
      dispatch(getStudyInfo({username: user.username, date: date.toString()}));
  }, [date, dispatch, user]);

  return (
    <View style={{marginBottom: 24}}>
      <Text
        style={{
          color: color.navy,
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 16,
        }}>
        과목별
      </Text>
      {subjects.map(subject => {
        return (
          <View key={subject}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
              <Text style={{color: 'black'}}>{subject}</Text>
              <Text
                style={{
                  color: 'black',
                }}>
                {getDisplayedTime(studyInfo[subject])}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 14,
                borderRadius: 999,
                backgroundColor: color.lightGray,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}>
              <Text style={{fontSize: 10, fontWeight: '700'}}>
                {Math.round((studyInfo[subject] / studyInfo.total) * 100)}%
              </Text>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  backgroundColor: subjectColors[subject],
                  borderRadius: 999,
                  height: 14,
                  width: `${Math.round(
                    (studyInfo[subject] / studyInfo.total) * 100,
                  )}%`,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ChartBySubject;
