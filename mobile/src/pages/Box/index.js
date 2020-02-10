import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import api from '../../services/api';

import {formatDistance, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import socket from 'socket.io-client';

import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

export default function Box({navigation}) {
  const boxId = navigation.getParam('boxId');

  const [boxInfo, setBoxInfo] = useState({});

  async function getBoxInfo() {
    const response = await api.get(`/boxes/${boxId}`);
    setBoxInfo(response.data);
  }

  useEffect(() => {
    subscribeToNewFiles(boxId);
    getBoxInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function subscribeToNewFiles(id) {
    const io = socket('https://mybox-omnistack.herokuapp.com');

    io.emit('connectRoom', id);

    io.on('file', data => {
      setBoxInfo({data, ...boxInfo});
    });
  }

  function handleUpload() {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('ImagePicker error');
      } else if (upload.didCancel) {
        console.log('Canceled by user');
      } else {
        const data = new FormData();
        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`,
        });

        await api.post(`/boxes/${boxInfo._id}/files`, data);

        getBoxInfo();
      }
    });
  }

  async function handleOpenFile(file) {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath,
      });

      await FileViewer.open(filePath);
    } catch (error) {
      console.log('Arquivo não suportado');
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.boxTitle}>{boxInfo.title}</Text>

      <FlatList
        style={styles.list}
        data={boxInfo.files}
        keyExtractor={file => file._id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleOpenFile(item)}
            style={styles.file}>
            <View style={styles.fileInfo}>
              <Icon name="insert-drive-file" size={24} color="#b5a0fa" />
              <Text style={styles.fileTitle}>{item.title}</Text>
            </View>

            <Text style={styles.fileDate}>
              há{' '}
              {formatDistance(parseISO(item.createdAt), new Date(), {
                locale: pt,
              })}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={handleUpload}>
        <Icon name="cloud-upload" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
