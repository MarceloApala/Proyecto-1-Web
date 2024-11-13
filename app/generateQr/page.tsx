"use client";
import React, { ChangeEvent, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { PDFDocument, rgb } from "pdf-lib";
import MapComponent from "@/components/Map";


export default function GenerateQr() {
  const [chasis, setChasis] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");
  const [vehicleData, setVehicleData] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const staticVehicleData = {
    make: "Volvo",
    model: "XC90",
    year: 2021,
    color: "Black",
    engine: "",
    transmission: "Automatic",
  };

  const generateQRCode = () => {
    const qrData = {
      chasis: chasis,
      ...staticVehicleData,
    };
    const qrString = JSON.stringify(qrData);
    setQrValue(qrString);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChasis(event.target.value);
  };

  const handleSave = async () => {
    if (!qrValue) {
      alert("Please generate a QR Code first.");
      return;
    }

    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const base64Image = canvas.toDataURL("image/png");
      const response = await fetch(
        "https://apprest3.onrender.com/api/automovil",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chasis: chasis,
            codigo_qr: base64Image,
          }),
        }
      );

      if (response.ok) {
        alert("Código QR guardado exitosamente.");
      } else {
        alert("Falló al guardar el código QR.");
      }
    } else {
      alert("No se pudo obtener el canvas del QR.");
    }
  };
  const handlePrint = async (): Promise<void> => {
    if (printRef.current && vehicleData) {
      try {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        // Tamaño de página 3x5 cm (convertido a puntos)
        const pageWidth = 3 * 28.35; // 3 cm en puntos
        const pageHeight = 5 * 28.35; // 5 cm en puntos
        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Añadir el código QR como imagen
        const qrCanvas = document.getElementById(
          "qr-canvas"
        ) as HTMLCanvasElement;
        if (!qrCanvas) {
          throw new Error("QR canvas not found");
        }
        const qrImageData = qrCanvas.toDataURL("image/png");
        const qrImageDataArrayBuffer = await fetch(qrImageData).then((res) =>
          res.arrayBuffer()
        );
        const qrImage = await pdfDoc.embedPng(qrImageDataArrayBuffer);

        // Calcular las dimensiones para el QR (más pequeño para dejar espacio para el texto)
        const qrSize = pageWidth * 0.7; // 70% del ancho de la página

        // Posicionar la imagen QR en la parte superior de la página
        const x = (pageWidth - qrSize) / 2; // Centrar horizontalmente
        const y = pageHeight - qrSize - 5; // 5 puntos de margen superior

        page.drawImage(qrImage, {
          x,
          y,
          width: qrSize,
          height: qrSize,
        });

        // Añadir datos de texto debajo de la imagen QR
        const fontSize = 6; // Reducir tamaño de fuente para que quepa
        const textColor = rgb(0, 0, 0); // Negro
        const textY = y - 10; // 10 puntos debajo de la imagen QR
        const lineHeight = 8;

        page.drawText(`Chasis: ${chasis}`, {
          x: 5,
          y: textY,
          size: fontSize,
          color: textColor,
        });
        page.drawText(`Make: ${vehicleData.make}`, {
          x: 5,
          y: textY - lineHeight,
          size: fontSize,
          color: textColor,
        });
        page.drawText(`Model: ${vehicleData.model}`, {
          x: 5,
          y: textY - 2 * lineHeight,
          size: fontSize,
          color: textColor,
        });
        page.drawText(`Year: ${vehicleData.year}`, {
          x: 5,
          y: textY - 3 * lineHeight,
          size: fontSize,
          color: textColor,
        });
        page.drawText(`Color: ${vehicleData.color}`, {
          x: 5,
          y: textY - 4 * lineHeight,
          size: fontSize,
          color: textColor,
        });
        page.drawText(`Trans: ${vehicleData.transmission}`, {
          x: 5,
          y: textY - 5 * lineHeight,
          size: fontSize,
          color: textColor,
        });

        // Serializar el documento PDF a bytes
        const pdfBytes = await pdfDoc.save();

        // Crear un blob y descargar el PDF
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qr-code-and-data.pdf";
        link.click();

        // Limpieza
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generando PDF:", error);
      }
    } else {
      console.error("printRef or vehicleData is null");
    }
  };
  const handleSearch = () => {
    setVehicleData(staticVehicleData);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <p className="mb-4">
        <strong>Generar QR</strong>
      </p>
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
        <div>
          <p>Chasis: {chasis}</p>
          <p>Make: {vehicleData.make}</p>
          <p>Model: {vehicleData.model}</p>
          <p>Year: {vehicleData.year}</p>
          <p>Color: {vehicleData.color}</p>
          <p>Transmission: {vehicleData.transmission}</p>
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
            style={{ display: "block" }} // Ensure QR is visible
          />
          <div className="flex mb-4">
            <Button onClick={handleSave} disabled={isSaving} className="mt-4">
              {isSaving ? "Guardando..." : "Guardar QR"}
            </Button>
            <Button onClick={handlePrint} className="mt-4 ml-2">
              Imprimir
            </Button>
          </div>
          <div ref={printRef} style={{ display: "none" }}>
            <div style={{ width: "300mm", height: "150mm", padding: "10mm" }}>
              <QRCodeCanvas
                id="qr-canvas-print"
                value={qrValue}
                size={120} // Adjust size for print
                style={{ display: "block", margin: "0 auto" }}
              />
              <div style={{ marginTop: "20mm" }}>
                <p>Chasis: {chasis}</p>
                <p>Make: {vehicleData?.make}</p>
                <p>Model: {vehicleData?.model}</p>
                <p>Year: {vehicleData?.year}</p>
                <p>Color: {vehicleData?.color}</p>
                <p>Transmission: {vehicleData?.transmission}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    
  );
}
