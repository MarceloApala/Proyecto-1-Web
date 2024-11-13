'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';

// Define the structure of the data to be fetched
interface DataItem {
  id: number;
  fecha_sistema: string;
  hora_sistema: string;
  latitud: number;
  longitud: number;
  chasis: string;
}

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'environment',
};

const QRCodeScanner: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const webcamRef = useRef<Webcam | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current && cameraActive) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = img.height;
            canvas.width = img.width;
            context.drawImage(img, 0, 0, img.width, img.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height, {
              inversionAttempts: 'dontInvert',
            });
            if (code) {
              setQrCode(code.data);
              const parsedData = JSON.parse(code.data);
              setInputValue(parsedData.chasis || '');
            } else {
              setQrCode('No QR code detected');
            }
          }
        };
      }
    }
  }, [webcamRef, cameraActive]);

  useEffect(() => {
    if (cameraActive) {
      const interval = setInterval(() => {
        capture();
      }, 1000); // Scan every second

      return () => clearInterval(interval);
    }
  }, [capture, cameraActive]);

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const handleSave = () => {
    if (latitude && longitude) {
      const currentDate = new Date();
      const fecha_sistema = currentDate.toISOString().split('T')[0]; // Solo la fecha en formato YYYY-MM-DD
      const hora_sistema = currentDate.toTimeString().split(' ')[0]; // Hora en formato HH:MM:SS

      const data = {
        fecha_sistema, // Fecha en formato "YYYY-MM-DD"
        hora_sistema, // Hora en formato "HH:MM:SS"
        latitud: latitude,
        longitud: longitude,
        chasis: inputValue,
      };

      fetch('https://apprest3.onrender.com/api/ubicacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log('Datos guardados exitosamente:', result);
          alert('Datos guardados exitosamente.');
        })
        .catch((error) => {
          console.error('Error al guardar los datos:', error);
          alert('Error al intentar guardar los datos.');
        });
    } else {
      console.error('No se pudieron obtener las coordenadas.');
      alert('No se pudieron obtener las coordenadas.');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          alert('Error al obtener la ubicación.');
        }
      );
    } else {
      console.error('La geolocalización no es soportada por este navegador.');
      alert('La geolocalización no es soportada por este navegador.');
    }
  };

  const fetchData = () => {
    fetch('https://apprest3.onrender.com/api/ubicacion')
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        setDataList(data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        alert('Error al obtener los datos.');
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mt-4 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Datos Listados:</h2>
        <ul className="list-disc pl-5">
          {dataList.map((item) => (
            <li key={item.id} className="mb-2">
              <p>ID: {item.id}</p>
              <p>Fecha: {item.fecha_sistema}</p>
              <p>Hora: {item.hora_sistema}</p>
              <p>Latitud: {item.latitud}</p>
              <p>Longitud: {item.longitud}</p>
              <p>Chasis: {item.chasis}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QRCodeScanner;
