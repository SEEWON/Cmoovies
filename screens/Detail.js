import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import colors from '../colors';
import Poster from '../components/Poster';

const Detail = ({ navigation: { setOptions }, route: { params } }) => {
  useEffect(() => {
    setOptions({
      title:
        'original_title' in params
          ? params.original_title
          : params.original_name,
    });
  }, []);
  return (
    <Container>
      <Poster path={params.poster_path || ''} />
    </Container>
  );
};

const Container = styled.ScrollView`
  background-color: ${colors.black};
`;

export default Detail;
