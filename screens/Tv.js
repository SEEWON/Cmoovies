import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { tvApi } from '../api';
import Hlist from '../components/HList';
import Loader from '../components/Loader';

const Tv = () => {
  const queryClient = useQueryClient();
  const {
    isLoading: todayLoading,
    data: todayData,
    isRefetching: todayRefetching,
  } = useQuery(['tv', 'today'], tvApi.airingToday);
  const {
    isLoading: topLoading,
    data: topData,
    isRefetching: topRefetching,
  } = useQuery(['tv', 'top'], tvApi.topRated);
  const {
    isLoading: trendingLoading,
    data: trendingData,
    isRefetching: trendingRefetching,
  } = useQuery(['tv', 'trending'], tvApi.trending);
  const onRefresh = () => {
    queryClient.refetchQueries('tv');
  };
  const loading = todayLoading || topLoading || trendingLoading;
  const refreshing = todayRefetching || topRefetching || trendingRefetching;
  console.log(refreshing);
  if (loading) {
    return <Loader />;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <Hlist title="Trending TV" data={trendingData.results} />
      <Hlist title="Airing today" data={todayData.results} />
      <Hlist title="Top Rated TV" data={topData.results} />
    </ScrollView>
  );
};
export default Tv;
