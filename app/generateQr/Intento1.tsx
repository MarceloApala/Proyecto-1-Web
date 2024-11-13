"use client";
import React, { ChangeEvent, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GenerateQr() {
  const [chasis, setChasis] = useState("");
  const [qrValue, setQrValue] = useState<string>("");
  const [vehicleData, setVehicleData] = useState<any>(null);

  const staticVehicleData = {
    make: "Volvo",
    model: "XC90",
    year: 2021,
    color: "Black",
    engine: "",
    transmission: "Automatic",
  };

  const generateQRCode = () => {
    if (vehicleData) {
      const qrData = {
        chasis: chasis,
        ...vehicleData,
      };
      const qrString = JSON.stringify(qrData);
      setQrValue(qrString);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChasis(event.target.value);
  };

  const handleSearch = () => {
    setVehicleData(staticVehicleData);
    alert(`Datos del vehículo para el chasis ${chasis} cargados correctamente.`);
  };

  const handleSaveAndPrint = async () => {
    if (qrValue) {
      try {
        // Simulación de POST
        const response = await fetch("/api/save-qr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrValue }),
        });

        if (response.ok) {
          alert("QR guardado exitosamente.");
          window.print(); // Imprimir la página
        } else {
          alert("Hubo un error al guardar el QR.");
        }
      } catch (error) {
        console.error("Error al guardar el QR:", error);
        alert("Error al intentar guardar el QR.");
      }
    } else {
      alert("Por favor, genera un QR antes de guardar.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1>Generar QR</h1>
      <div className="flex mb-4">
        <Input
          value={chasis}
          placeholder="Ingrese el número de chasis"
          type="text"
          onChange={handleInputChange}
          className="mr-2"
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      {vehicleData && (
        <div className="mb-4">
          <p>Marca: {vehicleData.make}</p>
          <p>Modelo: {vehicleData.model}</p>
          <p>Año: {vehicleData.year}</p>
          <p>Color: {vehicleData.color}</p>
          <p>Transmisión: {vehicleData.transmission}</p>
        </div>
      )}
      <Button onClick={generateQRCode} className="mb-4">
        Generar QR
      </Button>
      {qrValue && (
        <>
          <QRCodeCanvas
            id="qr-canvas"
            value={qrValue}
            size={200}
            style={{ display: "block" }}
          />
        </>
      )}
      <Button onClick={handleSaveAndPrint} className="mt-4">
        Guardar e Imprimir
      </Button>
    </div>
  );
}
