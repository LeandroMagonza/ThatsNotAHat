import { ImageSourcePropType } from 'react-native';

// Esta función simula la carga dinámica de imágenes desde archivos en React Native
// En una implementación real, esto podría hacerse con un sistema como require.context en web
// o el filesystem en React Native, pero aquí usamos un enfoque más simple

// Objeto que mapeará nombres de regalos a sus imágenes
const giftImages: Record<string, ImageSourcePropType> = {
  // Estas son imágenes de ejemplo, el usuario deberá reemplazarlas con imágenes reales
  // Las imágenes deberán colocarse en la carpeta src/assets/gifts
  'Hat': require('../assets/gifts/hat.png'),
  'Book': require('../assets/gifts/book.png'),
  'Guitar': require('../assets/gifts/guitar.png'),
  'Piano': require('../assets/gifts/piano.png'),
  'Muffin': require('../assets/gifts/muffin.png'),
  'Broccoli': require('../assets/gifts/broccoli.png'),
  'Watch': require('../assets/gifts/watch.png'),
  'Necklace': require('../assets/gifts/necklace.png'),
  'Scarf': require('../assets/gifts/scarf.png'),
  'Teapot': require('../assets/gifts/teapot.png'),
  'Candle': require('../assets/gifts/candle.png'),
  'Headphones': require('../assets/gifts/headphones.png'),
  'Sunglasses': require('../assets/gifts/sunglasses.png'),
  'Perfume': require('../assets/gifts/perfume.png'),
  'Chocolate': require('../assets/gifts/chocolate.png'),
  'Flowers': require('../assets/gifts/flowers.png'),
  'Teddy Bear': require('../assets/gifts/teddy_bear.png'),
  'Soccer Ball': require('../assets/gifts/soccer_ball.png'),
  'Lamp': require('../assets/gifts/lamp.png'),
  'Coffee Mug': require('../assets/gifts/coffee_mug.png'),
  // Imagen por defecto si no se encuentra
  'default': require('../assets/gifts/default.png')
};

// Lista de nombres de regalos disponibles
export const availableGifts = Object.keys(giftImages).filter(name => name !== 'default');

// Función para obtener la imagen de un regalo por su nombre
export const getGiftImage = (giftName: string): ImageSourcePropType => {
  // Si el nombre del regalo existe, devuelve su imagen, de lo contrario, devuelve la imagen por defecto
  return giftImages[giftName] || giftImages['default'];
};

// Función para verificar si un regalo tiene imagen
export const hasGiftImage = (giftName: string): boolean => {
  return giftName in giftImages;
}; 