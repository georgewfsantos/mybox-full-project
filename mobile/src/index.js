import React from 'react';
import {YellowBox, StatusBar, Platform} from 'react-native';

import Routes from './routes';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default function src() {
  return (
    <>
      <Routes />
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'default'}
        backgroundColor={Platform.OS === 'android' ? '#7159C1' : ''}
      />
    </>
  );
}
