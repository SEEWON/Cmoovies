import React, { useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import Slide from '../components/Slide';
import HMedia from '../components/HMedia';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { moviesApi } from '../api';
import Loader from '../components/Loader';
import Hlist from '../components/HList';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
//es6, same as SCREEN_HEIGHT = Dimensions.get('window').height;

const Movies = () => {
  const queryclient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery(
    ['movies', 'nowPlaying'],
    moviesApi.nowPlaying
  );
  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(['movies', 'upcoming'], moviesApi.upcoming, {
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });
  const { isLoading: trendingLoading, data: trendingData } = useQuery(
    ['movies', 'trending'],
    moviesApi.trending
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryclient.refetchQueries(['movies']);
    setRefreshing(false);
  };

  const renderHMedia = ({ item }) => (
    <HMedia
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      overview={item.overview}
      releaseDate={item.release_date}
      fullData={item}
    />
  );
  const movieKeyExtractor = (item) => item.id + '';

  const loading = nowPlayingLoading || trendingLoading || upcomingLoading;
  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  return loading ? (
    <Loader />
  ) : (
    <FlatList
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
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
            {nowPlayingData.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path}
                posterPath={movie.poster_path}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          <Hlist title="Trending Movies" data={trendingData.results} />
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcomingData.pages.map((page) => page.results).flat()}
      keyExtractor={movieKeyExtractor}
      ItemSeparatorComponent={HSeperator}
      renderItem={renderHMedia}
    ></FlatList>
  );
};

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 10px;
`;

const HSeperator = styled.View`
  height: 20px;
`;

export default Movies;
