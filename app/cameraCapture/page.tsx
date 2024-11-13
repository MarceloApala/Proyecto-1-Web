"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map"

import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import('@/components/Mapa'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "environment",
};

const QRCodeScanner: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const [showMap, setShopMap] = useState<boolean>(false)



  const capture = useCallback(() => {
    if (webcamRef.current && cameraActive) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (context) {
            canvas.height = img.height;
            canvas.width = img.width;
            context.drawImage(img, 0, 0, img.width, img.height);
            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(imageData.data, canvas.width, canvas.height, {
              inversionAttempts: "dontInvert",
            });
            if (code) {
              setQrCode(code.data);
              const parsedData = JSON.parse(code.data);
              setInputValue(parsedData.chasis || "");
            } else {
              setQrCode("No QR code detected");
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
      setIsSaving(true);
      setSaveMessage(null); // Reset message

      const currentDate = new Date();
      const fecha_sistema = currentDate.toISOString().split("T")[0]; // Solo la fecha en formato YYYY-MM-DD
      const hora_sistema = currentDate.toTimeString().split(" ")[0]; // Hora en formato HH:MM:SS

      const data = {
        fecha_sistema, // Fecha en formato "YYYY-MM-DD"
        hora_sistema, // Hora en formato "HH:MM:SS"
        latitud: latitude,
        longitud: longitude,
        chasis: inputValue,
      };

      setTimeout(() => {
        fetch("https://apprest3.onrender.com/api/ubicacion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log("Datos guardados exitosamente:", result);
            setSaveMessage("Datos guardados exitosamente.");
          })
          .catch((error) => {
            console.error("Error al guardar los datos:", error);
            setSaveMessage("Error al intentar guardar los datos.");
          })
          .finally(() => {
            setIsSaving(false);
          });
      }, 2000); // 2 segundos de delay
    } else {
      console.error("No se pudieron obtener las coordenadas.");
      alert("No se pudieron obtener las coordenadas.");
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
          setShopMap(true)
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          alert("Error al obtener la ubicación.");
        }
      );
    } else {
      console.error("La geolocalización no es soportada por este navegador.");
      alert("La geolocalización no es soportada por este navegador.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">

      {cameraActive && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      )}
      <div className="mt-4">
        <p>{qrCode ? `QR Code Data: ${qrCode}` : "No QR code detected"}</p>
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ingrese el chasis"
        className="mt-4 p-2 border rounded"
      />
      <Button onClick={toggleCamera} className="mt-4">
        {cameraActive ? "Desactivar Cámara" : "Activar Cámara"}
      </Button>

      <Button onClick={handleGetLocation} className="mt-4">
        Obtener Ubicación
      </Button>

      {latitude && longitude && (
        <div className="mt-4">
          <p>Latitud: {latitude}</p>
          <p>Longitud: {longitude}</p>
        </div>
      )}

      <Button onClick={handleSave} className="mt-4" disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar"}
      </Button>

      {saveMessage && (
        <div className="mt-4">
          <p>{saveMessage}</p>
        </div>
      )}

      {
        showMap && latitude && longitude && (
          <LazyMap latitude={latitude} longitude={longitude} />
        )
      }
    </div>
  );
};

export default QRCodeScanner;
