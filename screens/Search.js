import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components/native';
import { moviesApi, tvApi } from '../api';
import Hlist from '../components/HList';
import Loader from '../components/Loader';

const Search = () => {
  const [query, setQuery] = useState('');
  const {
    isLoading: moviesLoading,
    data: moviesData,
    refetch: searchMovies,
  } = useQuery(['searchMovies', query], moviesApi.search, {
    enabled: false,
  });
  const {
    isLoading: tvLoading,
    data: tvData,
    refetch: searchTv,
  } = useQuery(['searchTv', query], tvApi.search, {
    enabled: false,
  });
  const onChangeText = (text) => setQuery(text);
  const onSubmit = () => {
    if (query === '') {
      return;
    }
    searchMovies();
    searchTv();
  };
  return (
    <Container>
      <SearchBar
        placeholder="Search for Movie or TV Show"
        placeholderTextTextColor="grey"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      {moviesLoading || tvLoading ? <Loader /> : null}
      {moviesData ? (
        <Hlist title="Movie Results" data={moviesData.results} />
      ) : null}
      {tvData ? <Hlist title="Tv Results" data={tvData.results} /> : null}
    </Container>
  );
};

const Container = styled.ScrollView``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
  margin-bottom: 40px;
`;

export default Search;
