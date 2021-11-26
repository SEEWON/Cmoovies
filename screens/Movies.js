import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import Slide from '../components/Slide';
import VMedia from '../components/VMedia';
import HMedia from '../components/HMedia';

const API_KEY = '95d088d12c9645bd0c69bc51a80df3a1';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
//es6, same as SCREEN_HEIGHT = Dimensions.get('window').height;

const Movies = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const getTrending = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    );
    const json = await response.json();
    setTrending(json.results);
  };
  const getUpcoming = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=KR`
    );
    const json = await response.json();
    setUpcoming(json.results);
  };
  const getNowPlaying = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=KR`
    );
    const json = await response.json();
    setNowPlaying(json.results);
  };
  const getData = async () => {
    await Promise.all([getTrending(), getUpcoming(), getNowPlaying()]);
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };
  return loading ? (
    <Loader>
      <ActivityIndicator size="large" color="#0000ff" />
    </Loader>
  ) : (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsPagination={false}
            controlsEnabled={false}
            containerStyle={{
              marginBottom: 30,
              width: '100%',
              height: SCREEN_HEIGHT / 4,
            }}
          >
            {nowPlaying.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path}
                posterPath={movie.poster_path}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
              />
            ))}
          </Swiper>
          <ListContainer>
            <ListTitle>Trending Movies</ListTitle>
            <TrendingScroll
              horizontal
              keyExtractor={(item) => item.id + ''}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              ItemSeparatorComponent={() => <View style={{ width: 20 }}></View>}
              data={trending}
              renderItem={({ item }) => (
                <VMedia
                  posterPath={item.poster_path}
                  originalTitle={item.original_title}
                  voteAverage={item.vote_average}
                />
              )}
            />
          </ListContainer>
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcoming}
      keyExtractor={(item) => item.id + ''}
      ItemSeparatorComponent={() => <View style={{ height: 30 }}></View>}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
        />
      )}
    ></FlatList>
  );
};

const Container = styled.ScrollView``;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const TrendingScroll = styled.FlatList`
  margin-top: 20px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 10px;
`;

export default Movies;
