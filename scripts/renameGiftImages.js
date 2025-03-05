const fs = require('fs');
const path = require('path');

const giftsFolder = path.join(__dirname, '../src/assets/gifts');

console.log(`Escaneando la carpeta: ${giftsFolder}`);

// Leer la carpeta de imágenes
let files;
try {
  files = fs.readdirSync(giftsFolder);
} catch (error) {
  console.error(`Error al leer la carpeta de imágenes: ${error.message}`);
  process.exit(1);
}

// Filtrar solo archivos de imágenes
const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file) && file !== 'default.png');

console.log(`Encontrados ${imageFiles.length} archivos de imagen`);

// Procesar cada archivo
imageFiles.forEach(fileName => {
  try {
    // Extraer la extensión del archivo
    const extension = path.extname(fileName);
    
    // Extraer el nombre real del regalo (asumiendo que está después del último guión bajo y antes de la extensión)
    let giftName = fileName.split('_').pop().replace(extension, '');
    
    // Si hay números al principio o final, los eliminamos
    giftName = giftName.replace(/^\d+|\d+$/g, '');
    
    // Convertir a minúsculas para seguir la convención
    const newFileName = giftName.toLowerCase() + extension;
    
    // Rutas completas
    const oldPath = path.join(giftsFolder, fileName);
    const newPath = path.join(giftsFolder, newFileName);
    
    // Verificar si el archivo de destino ya existe
    if (fs.existsSync(newPath) && oldPath !== newPath) {
      console.log(`⚠️ Ya existe un archivo con el nombre ${newFileName}, renombrando a una variante`);
      // Agregar un número aleatorio para evitar duplicados
      const randomSuffix = Math.floor(Math.random() * 1000);
      const newFileNameWithSuffix = `${giftName.toLowerCase()}_${randomSuffix}${extension}`;
      const newPathWithSuffix = path.join(giftsFolder, newFileNameWithSuffix);
      fs.renameSync(oldPath, newPathWithSuffix);
      console.log(`✅ Renombrado: ${fileName} -> ${newFileNameWithSuffix}`);
    } else {
      // Renombrar el archivo
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renombrado: ${fileName} -> ${newFileName}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${fileName}: ${error.message}`);
  }
});

console.log('\nProceso completado. Ahora ejecuta "npm run generate-gifts" para actualizar la lista de regalos.'); 