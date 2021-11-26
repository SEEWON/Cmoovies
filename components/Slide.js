import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import styled from 'styled-components/native';
import { makeImgPath } from '../utils';
import { BlurView } from 'expo-blur';
import Poster from './Poster';

const Slide = ({
  backdropPath,
  posterPath,
  originalTitle,
  voteAverage,
  overview,
}) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={{ flex: 1 }}>
      <BgImg
        style={StyleSheet.absoluteFill}
        source={{ uri: makeImgPath(backdropPath) }}
      ></BgImg>
      <BlurView
        intensity={95}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      >
        <Wrapper>
          <Poster path={posterPath} />
          <Column>
            <Title>{originalTitle}</Title>
            {voteAverage > 0 ? <Votes>⭐{voteAverage}/10</Votes> : null}
            <Overview>{overview.slice(0, 55)}...</Overview>
          </Column>
        </Wrapper>
      </BlurView>
    </View>
  );
};

const BgImg = styled.Image``;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;
const Wrapper = styled.View`
  flex-direction: row;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const Column = styled.View`
  width: 40%;
  margin-left: 15px;
`;
const Overview = styled.Text`
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.6);
`;
const Votes = styled(Overview)`
  font-size: 12px;
`;

export default Slide;
