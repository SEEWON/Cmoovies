import React from 'react';
import styled from 'styled-components/native';
import { makeImgPath } from '../utils';

const Poster = ({ path }) => <Image source={{ uri: makeImgPath(path) }} />;

const Image = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.5);
`;

export default Poster;
