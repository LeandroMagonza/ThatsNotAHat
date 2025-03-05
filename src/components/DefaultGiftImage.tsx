import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { captureRef } from 'react-native-view-shot';

interface DefaultGiftImageProps {
  onCapture: (uri: string) => void;
}

/**
 * Componente que genera una imagen por defecto para los regalos
 * Use este componente una única vez al inicio de la aplicación para
 * generar la imagen default.png en caso de no existir.
 */
const DefaultGiftImage: React.FC<DefaultGiftImageProps> = ({ onCapture }) => {
  const viewRef = React.useRef<View>(null);
  
  React.useEffect(() => {
    if (viewRef.current) {
      setTimeout(() => {
        captureRef(viewRef, {
          format: 'png',
          quality: 1,
        }).then((uri) => {
          onCapture(uri);
        }).catch(err => {
          console.error('Error capturing default image:', err);
        });
      }, 100);
    }
  }, [onCapture]);
  
  return (
    <View
      ref={viewRef}
      style={styles.container}
    >
      <View style={styles.giftBox}>
        <View style={styles.boxTop} />
        <View style={styles.boxBody} />
        <View style={styles.ribbonVertical} />
        <View style={styles.ribbonHorizontal} />
      </View>
      <Text style={styles.questionMark}>?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftBox: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  boxBody: {
    width: 100,
    height: 70,
    backgroundColor: '#3498db',
    position: 'absolute',
    bottom: 0,
    left: 10,
    borderRadius: 4,
  },
  boxTop: {
    width: 110,
    height: 30,
    backgroundColor: '#2980b9',
    position: 'absolute',
    top: 20,
    left: 5,
    borderRadius: 4,
  },
  ribbonVertical: {
    width: 10,
    height: 100,
    backgroundColor: '#e74c3c',
    position: 'absolute',
    left: 55,
    top: 0,
  },
  ribbonHorizontal: {
    width: 100,
    height: 10,
    backgroundColor: '#e74c3c',
    position: 'absolute',
    left: 10,
    top: 35,
  },
  questionMark: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#7f8c8d',
    position: 'absolute',
    top: 70,
  },
});

export default DefaultGiftImage; 