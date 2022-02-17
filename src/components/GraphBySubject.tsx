import React, {useCallback} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {useUser} from '../providers/UserProvider';
import {useAppDispatch, useAppSelector} from '../hooks/useReduxFunction';
import {
  getStudyInfo,
  selectStudyInfo,
  selectUpdateState,
} from '../redux/studyInfoSlice';
import {subjectColors, subjects} from '../data/study';
import getDisplayedTime from '../utils/getDisplayedTime';
import {color, Theme} from '../theme/color';
import {useFocusEffect} from '@react-navigation/native';
import {StyledText} from './shared/StyledText';
import styled from 'styled-components/native';

const GraphBySubject = ({date}: {date: number}) => {
  const {user} = useUser();
  const studyInfo = useAppSelector(selectStudyInfo);
  const dispatch = useAppDispatch();
  const updateState = useAppSelector(selectUpdateState);

  useFocusEffect(
    useCallback(() => {
      user &&
        updateState === 'succeeded' &&
        dispatch(getStudyInfo({username: user.username, date: date}));
    }, [date, dispatch, updateState, user]),
  );

  const SubText = styled.Text`
    color: ${({theme}: {theme: Theme}) => theme.subText};
  `;

  const Box = styled.View`
    background-color: ${({theme}: {theme: Theme}) => theme.box};
  `;

  return (
    <View style={{paddingHorizontal: 20}}>
      <SubText
        style={{
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 16,
        }}>
        과목별
      </SubText>
      {studyInfo.date === date ? (
        studyInfo.total === 0 ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: color.gray, fontSize: 16}}>
              학습 기록이 없어요
            </Text>
          </View>
        ) : (
          subjects.map(subject => {
            return (
              <View key={subject}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}>
                  <StyledText>{subject}</StyledText>
                  <StyledText>
                    {getDisplayedTime(studyInfo[subject])}
                  </StyledText>
                </View>
                <Box
                  style={{
                    width: '100%',
                    height: 14,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                  <StyledText
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      zIndex: 1,
                    }}>
                    {Math.round((studyInfo[subject] / studyInfo.total) * 100)}%
                  </StyledText>
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
                </Box>
              </View>
            );
          })
        )
      ) : (
        <ActivityIndicator color={color.primary} />
      )}
    </View>
  );
};

export default GraphBySubject;
