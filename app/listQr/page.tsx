"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface QRData {
  id: number;
  chasis: string;
  codigo_qr: string;
}

const ListQR: React.FC = () => {
  const [qrList, setQrList] = useState<QRData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch QR data from the API with a delay
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://apprest3.onrender.com/api/automovil"
        );
        if (response.ok) {
          const data: QRData[] = await response.json();
          setQrList(data);
        } else {
          console.error("Failed to fetch QR data");
        }
      } catch (error) {
        console.error("Error fetching QR data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000); // 3 seconds delay
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-48">
        <p className="text-xl font-semibold">Cargando, espere por favor...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1>
        <strong>Lista de Códigos</strong>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qrList.map((qr) => (
          <div key={qr.id} className="border p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Chasis: {qr.chasis}</h2>
            {qr.codigo_qr && (
              <Image
                src={qr.codigo_qr}
                alt={`QR Code for chasis ${qr.chasis}`}
                width={200}
                height={200}
                layout="responsive"
              />
            )}
          </div>
        ))}
      </div>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Refresh List
      </Button>
    </div>
  );
};

export default ListQR;
