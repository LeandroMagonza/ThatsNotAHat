// Archivo generado automáticamente - no editar manualmente
import { ImageSourcePropType } from 'react-native';
import DefaultImg from '../assets/gifts/default.png';
import AppleImg from '../assets/gifts/apple.png';
import BananaImg from '../assets/gifts/banana.png';
import BootImg from '../assets/gifts/boot.png';
import CakeImg from '../assets/gifts/cake.png';
import CameraImg from '../assets/gifts/camera.png';
import CarrotImg from '../assets/gifts/carrot.png';
import CrabImg from '../assets/gifts/crab.png';
import DolphinImg from '../assets/gifts/dolphin.png';
import DonutImg from '../assets/gifts/donut.png';
import HedgehogImg from '../assets/gifts/hedgehog.png';
import HotDogImg from '../assets/gifts/hot-dog.png';
import IcecreamImg from '../assets/gifts/icecream.png';
import KiteImg from '../assets/gifts/kite.png';
import LeafImg from '../assets/gifts/leaf.png';
import PencilImg from '../assets/gifts/pencil.png';
import PopsicleImg from '../assets/gifts/popsicle.png';
import PumpkinImg from '../assets/gifts/pumpkin.png';
import RocketImg from '../assets/gifts/rocket.png';
import ShovelImg from '../assets/gifts/shovel.png';
import TeapotImg from '../assets/gifts/teapot.png';
import TomatoImg from '../assets/gifts/tomato.png';
import WatermelonImg from '../assets/gifts/watermelon.png';

// Lista de nombres de regalos disponibles
export const gifts = [
  "Apple",
  "Banana",
  "Boot",
  "Cake",
  "Camera",
  "Carrot",
  "Crab",
  "Dolphin",
  "Donut",
  "Hedgehog",
  "Hot Dog",
  "Icecream",
  "Kite",
  "Leaf",
  "Pencil",
  "Popsicle",
  "Pumpkin",
  "Rocket",
  "Shovel",
  "Teapot",
  "Tomato",
  "Watermelon"
];

// Mapa de nombres de regalos a sus imágenes
const giftImagesMap: Record<string, ImageSourcePropType> = {
  "Apple": AppleImg,
  "Banana": BananaImg,
  "Boot": BootImg,
  "Cake": CakeImg,
  "Camera": CameraImg,
  "Carrot": CarrotImg,
  "Crab": CrabImg,
  "Dolphin": DolphinImg,
  "Donut": DonutImg,
  "Hedgehog": HedgehogImg,
  "Hot Dog": HotDogImg,
  "Icecream": IcecreamImg,
  "Kite": KiteImg,
  "Leaf": LeafImg,
  "Pencil": PencilImg,
  "Popsicle": PopsicleImg,
  "Pumpkin": PumpkinImg,
  "Rocket": RocketImg,
  "Shovel": ShovelImg,
  "Teapot": TeapotImg,
  "Tomato": TomatoImg,
  "Watermelon": WatermelonImg,
};

// Función para obtener la imagen del regalo
export const getGiftImageSource = (giftName: string): ImageSourcePropType => {
  const image = giftImagesMap[giftName];
  return image || DefaultImg;
};
