# Imágenes de Regalos

Esta carpeta contiene las imágenes de los regalos utilizados en el juego "That's Not a Hat!".

## Formato de imágenes

- **Formato recomendado**: PNG o JPG
- **Resolución recomendada**: 400x300 píxeles (relación 4:3)
- **Fondo recomendado**: Transparente (PNG) o blanco sólido

## Cómo agregar nuevas imágenes

1. Crea una imagen del regalo con la resolución recomendada.
2. Nombra el archivo siguiendo estas convenciones:
   - Usa nombres en minúsculas
   - Reemplaza espacios con guiones bajos
   - Ejemplos: `coffee_mug.png`, `teddy_bear.jpg`

3. Coloca el archivo en esta carpeta (`src/assets/gifts/`)
4. Al reiniciar la aplicación, el regalo aparecerá automáticamente en la lista

## Resoluciones óptimas por tamaño

- **Pequeñas**: 160 x 120 píxeles
- **Medianas**: 240 x 180 píxeles 
- **Grandes**: 400 x 300 píxeles

## Imagen por defecto

El archivo `default.png` se usa cuando:
- Se solicita una imagen que no existe
- Hay un error al cargar la imagen especificada

Si no existe este archivo, la aplicación podría mostrar errores.

## Generación automática

Al iniciar la aplicación, se escanea esta carpeta para generar automáticamente la lista de regalos disponibles. No es necesario editar ningún otro archivo para agregar un nuevo regalo; simplemente añade la imagen aquí y reinicia la aplicación. 