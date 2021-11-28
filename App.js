import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { Asset, useAssets } from 'expo-asset';
import { Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';

const queryClient = new QueryClient();

export default function App() {
  const [assets] = useAssets([require('./assets/crypto.png')]);
  const [loaded] = Font.useFonts(Ionicons.font);

  if (!assets || !loaded) {
    return <AppLoading />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Tabs></Tabs>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
