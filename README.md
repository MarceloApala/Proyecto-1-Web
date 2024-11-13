# **Aplicación Web de Control de Inventario**

Este proyecto es una aplicación web desarrollada con **Next.js** para la gestión de inventarios. La aplicación permite generar códigos QR, ver una lista de códigos QR asociados a productos y escanear códigos QR directamente desde la cámara del dispositivo, lo que facilita el control y seguimiento de los artículos del inventario.

## Descripción

La aplicación facilita la gestión de inventarios mediante el uso de **códigos QR**. Las funcionalidades incluyen:

- **Generar códigos QR**: Asociar códigos QR únicos a productos del inventario.
- **Ver lista de códigos QR**: Acceder a una lista visual de todos los códigos QR generados.
- **Escanear códigos QR**: Utilizar la cámara del dispositivo para escanear códigos QR y obtener los detalles del producto.

## Tecnologías y Librerías Utilizadas

- **Next.js**: Framework React para la creación de aplicaciones web con renderizado tanto del lado del servidor como del cliente.
- **TailwindCSS**: Framework de utilidades CSS para un diseño rápido y eficiente.
- **React Hook Form**: Librería para manejar formularios de manera eficiente en React.
- **jsQR**: Librería para el escaneo de códigos QR.
- **qrcode.react**: Librería para generar códigos QR en formato React.
- **React Webcam**: Para integrar la funcionalidad de escaneo de códigos QR utilizando la cámara web del dispositivo.
- **pdf-lib y pdfmake**: Librerías para la creación y manipulación de archivos PDF.
- **Leaflet**: Biblioteca de JavaScript para mapas interactivos (se puede usar para agregar ubicación de productos o gestionar inventarios con ubicación geográfica).
- **Zod**: Biblioteca de validación y esquema de tipos para asegurar que los datos del inventario sean correctos.
- **Dom-to-image & html2canvas**: Para convertir elementos HTML a imágenes, útil para generar imágenes de los productos con sus códigos QR.

## Comenzando

### Requisitos previos

Asegúrate de tener **Node.js** y **npm** instalados en tu máquina. Puedes descargar **Node.js** desde [aquí](https://nodejs.org/).

### Instalación y configuración

1. **Clonar el repositorio**

   Si aún no tienes el proyecto en tu máquina local, clónalo del repositorio

2. **Instalar las dependencias**
   npm install

3. **Iniciar el servidor de desarrollo**
   npm run dev 
   Esto levantará el servidor en http://localhost:3000, donde podrás ver la aplicación funcionando.
