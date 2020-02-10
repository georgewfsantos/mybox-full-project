import React, {useState, useEffect} from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import logo from '../../assets/logo.png';

import styles from './styles';

export default function Main({navigation}) {
  const [newBox, setNewBox] = useState('');
  async function handleCreateBox() {
    const response = await api.post('boxes', {
      title: newBox,
    });

    await AsyncStorage.setItem('@RocketBox:boxId', response.data._id);

    navigation.navigate('Box');
  }

  useEffect(() => {
    async function getBoxInfo() {
      const boxId = await AsyncStorage.getItem('@RocketBox:boxId');

      if (boxId) {
        navigation.navigate('Box', {boxId});
      }
    }
    getBoxInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <TextInput
        style={styles.input}
        placeholder="Crie um box"
        placeholderTextColor="#999"
        autoCapitalize="none"
        autocorrect={false}
        value={newBox}
        onChangeText={setNewBox}
        underlineColorAndroid="transparent"
      />

      <TouchableOpacity onPress={handleCreateBox} style={styles.button}>
        <Text style={styles.buttonText}> Criar</Text>
      </TouchableOpacity>
    </View>
  );
}
