const fs = require('fs');
const path = require('path');

const giftsFolder = path.join(__dirname, '../src/assets/gifts');
const outputFile = path.join(__dirname, '../src/data/generatedGifts.ts');

console.log(`Escaneando la carpeta: ${giftsFolder}`);

// Asegurar que la carpeta de destino existe
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
  console.log(`Creando directorio: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Crear una carpeta de regalos si no existe
if (!fs.existsSync(giftsFolder)) {
  console.log(`Creando carpeta de regalos: ${giftsFolder}`);
  fs.mkdirSync(giftsFolder, { recursive: true });
  
  // Crear un archivo default.png para evitar errores si no hay imágenes
  console.log('Creando imagen por defecto para evitar errores...');
  // Esto crearía una imagen por defecto si tuviéramos una fuente
  // Por ahora, simplemente logueamos que se debería crear manualmente
  console.log('NOTA: Debes crear manualmente una imagen default.png en src/assets/gifts');
}

// Leer la carpeta de imágenes
let files;
try {
  files = fs.readdirSync(giftsFolder);
} catch (error) {
  console.error(`Error al leer la carpeta de imágenes: ${error.message}`);
  files = [];
}

// Filtrar solo archivos de imágenes y extraer nombres sin extensión
const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));
const giftNames = imageFiles
  .map(file => {
    // Convertir snake_case o kebab-case a título normal: coffee_mug.png -> Coffee Mug
    const baseName = path.basename(file, path.extname(file));
    return baseName
      .replace(/[-_]/g, ' ')
      .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  })
  .filter(name => name !== 'Default'); // Excluir la imagen por defecto

// Mapeo de nombres de regalos a archivos
const giftFileMap = {};
imageFiles.forEach(file => {
  const baseName = path.basename(file, path.extname(file));
  const formattedName = baseName
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  
  if (formattedName !== 'Default') {
    giftFileMap[formattedName] = file;
  }
});

// Si no hay imágenes, agregar algunos nombres por defecto
if (giftNames.length === 0) {
  console.log('No se encontraron imágenes, usando lista de regalos por defecto');
  giftNames.push(
    'Hat', 'Book', 'Guitar', 'Piano', 'Muffin', 'Broccoli', 'Watch', 'Necklace',
    'Scarf', 'Teapot', 'Candle', 'Headphones', 'Sunglasses', 'Perfume',
    'Chocolate', 'Flowers', 'Teddy Bear', 'Soccer Ball', 'Lamp', 'Coffee Mug'
  );

  console.log('NOTA: Debes crear manualmente imágenes para estos regalos.');
  console.log('Los archivos deben nombrarse en minúsculas con guiones bajos, ejemplos:');
  giftNames.forEach(name => {
    console.log(`- ${name.toLowerCase().replace(/ /g, '_')}.png`);
  });
}

// Generar importaciones estáticas para cada imagen
const importStatements = [];
const importMap = {};

// Importar imagen por defecto primero
if (files.includes('default.png')) {
  importStatements.push(`import DefaultImg from '../assets/gifts/default.png';`);
} else {
  console.warn('Advertencia: No se encontró default.png');
}

// Generar importaciones para cada archivo de imagen
Object.keys(giftFileMap).forEach(giftName => {
  const fileName = giftFileMap[giftName];
  const variableName = giftName.replace(/\W/g, '') + 'Img';
  importStatements.push(`import ${variableName} from '../assets/gifts/${fileName}';`);
  importMap[giftName] = variableName;
});

// Generar el archivo TypeScript con la lista y función para obtener imágenes
const fileContent = `// Archivo generado automáticamente - no editar manualmente
import { ImageSourcePropType } from 'react-native';
${importStatements.join('\n')}

// Lista de nombres de regalos disponibles
export const gifts = ${JSON.stringify(giftNames, null, 2)};

// Mapa de nombres de regalos a sus imágenes
const giftImagesMap: Record<string, ImageSourcePropType> = {
${Object.keys(importMap).map(giftName => `  "${giftName}": ${importMap[giftName]},`).join('\n')}
};

// Función para obtener la imagen del regalo
export const getGiftImageSource = (giftName: string): ImageSourcePropType => {
  const image = giftImagesMap[giftName];
  return image || ${files.includes('default.png') ? 'DefaultImg' : '{uri: ""}'};
};
`;

// Escribir el archivo
try {
  fs.writeFileSync(outputFile, fileContent);
  console.log(`Generados ${giftNames.length} nombres de regalos en ${outputFile}`);
} catch (error) {
  console.error(`Error al escribir el archivo de salida: ${error.message}`);
} 