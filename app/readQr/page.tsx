"use client";

import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";

interface Location {
  latitude: number;
  longitude: number;
}

const videoConstraints: MediaTrackConstraints = {
  width: 400,
  height: 400,
  facingMode: "environment",
};
export default function ReadQr() {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const webcamRef = useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  const getLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  var chasis = "1234567890";

  const sendPhotoServer = async (image: string | null): Promise<void> => {
    if (!image) return;
    try {
      const response = await fetch(
        "https://apprest3.onrender.com/api/automovil",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chasis: chasis, codigo_qr: image }),
        }
      );
      if (response.ok) {
        console.log("Foto enviada correctamente");
      } else {
        console.log("Error al enviar la foto");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor", error);
    }
  };
  const capturePhoto = useCallback((): void => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
      sendPhotoServer(imageSrc);
    } else {
      console.log("Webcam not initialized");
    }
  }, [webcamRef]);
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={() => setIsCameraReady(true)}
      />
      <div className="mt-4 space-y-2">
        <Button onClick={capturePhoto} disabled={!isCameraReady}>
          Capturar Foto
        </Button>
        <Button onClick={getLocation}>Obtener Ubicación</Button>
      </div>
      {imageSrc && (
        <div className="mt-4">
          <img src={imageSrc} alt="Captured" className="max-w-full h-auto" />
        </div>
      )}
      {location.latitude !== 0 && location.longitude !== 0 && (
        <p className="mt-4">
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </p>
      )}
    </div>
  );
}
