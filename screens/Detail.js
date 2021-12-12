import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useQuery } from 'react-query';
import styled from 'styled-components/native';
import { moviesApi, tvApi } from '../api';
import colors from '../colors';
import Poster from '../components/Poster';
import { makeImgPath } from '../utils';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Detail = ({ navigation: { setOptions }, route: { params } }) => {
  const isMovie = 'original_title' in params;

  const { isLoading, data } = useQuery(
    [isMovie ? 'movies' : 'tv', params.id],
    isMovie ? moviesApi.detail : tvApi.detail
  );

  const shareMedia = async () => {
    const isAndroid = Platform.OS === 'android';
    const homepage = isMovie
      ? `https://www.imdb.com/title/${data.imdb_id}`
      : data.homepage;
    if (isAndroid) {
      await Share.share({
        message: `${params.overview}\nCheck it out: ${homepage}`,
        title: isMovie ? params.original_title : params.original_name,
      });
    } else {
      await Share.share({
        url: homepage,
        title: isMovie ? params.original_title : params.original_name,
      });
    }
  };
  const ShareButton = () => (
    <TouchableOpacity onPress={shareMedia}>
      <Ionicons name="share-outline" color="white" size={24} />
    </TouchableOpacity>
  );

  useEffect(() => {
    setOptions({
      title: 'original_title' in params ? 'Movie' : 'TV Show',
    });
  }, []);

  useEffect(() => {
    if (data) {
      setOptions({
        headerRight: () => <ShareButton />,
      });
    }
  }, [data]);

  const openYTLink = async (videoID) => {
    const baseUrl = `https://m.youtube.com/watch?v=${videoID}`;
    await Linking.openURL(baseUrl);
  };

  return (
    <Container>
      <Header>
        <Background
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(params.backdrop_path || '') }}
        />
        <Column>
          <Poster path={params.poster_path || ''} />
          <Title>
            {'original_title' in params
              ? params.original_title
              : params.original_name}
          </Title>
        </Column>
      </Header>
      <Data>
        <Overview>{params.overview}</Overview>
        {data?.videos.results?.map((video) => (
          <VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
            <Ionicons name="logo-youtube" color="white" size={24} />
            <BtnText>{video.name}</BtnText>
          </VideoBtn>
        ))}
      </Data>
    </Container>
  );
};

const Container = styled.ScrollView`
  background-color: ${colors.black};
`;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Background = styled.Image``;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;

const Title = styled.Text`
  color: white;
  font-size: 36px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;

const Data = styled.View`
  padding: 0px 20px;
`;

const Overview = styled.Text`
  color: white;
  margin-top: 20px;
  padding: 20px 0px;
`;
const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
`;
const BtnText = styled.Text`
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 24px;
  margin-left: 10px;
`;

export default Detail;
