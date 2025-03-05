const fs = require('fs');
const path = require('path');

const giftsFolder = path.join(__dirname, '../src/assets/gifts');
const defaultImagePath = path.join(giftsFolder, 'default.png');

// Asegurar que la carpeta existe
if (!fs.existsSync(giftsFolder)) {
  console.log(`Creando carpeta: ${giftsFolder}`);
  fs.mkdirSync(giftsFolder, { recursive: true });
}

// Verificar si ya existe la imagen default
if (fs.existsSync(defaultImagePath)) {
  console.log('La imagen default.png ya existe');
  process.exit(0);
}

// Datos de una imagen PNG muy simple (1x1 píxel transparente)
// Estos bytes representan un PNG válido mínimo con un píxel transparente
const minimalPng = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
  0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

try {
  fs.writeFileSync(defaultImagePath, minimalPng);
  console.log(`Imagen default.png creada en ${defaultImagePath}`);
} catch (error) {
  console.error(`Error al crear la imagen default.png: ${error.message}`);
} 