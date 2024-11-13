"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FormQr() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [foto1, setFoto1] = useState<File | null>(null);
  const [foto2, setFoto2] = useState<File | null>(null);
  const [foto3, setFoto3] = useState<File | null>(null);
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitud(position.coords.latitude.toString());
      setLongitud(position.coords.longitude.toString());
    });
  }, []);

  const handleGuardarDatos = () => {
    const datos = {
      nombres,
      apellidos,
      fotos: [foto1, foto2, foto3],
      latitud,
      longitud,
    };
    console.log("Datos guardados:", datos);
    // Aquí podrías enviar los datos a tu backend o manejarlos como necesites
  };

  return (
    <div className="flex justify-center items-center mt-10 mb-10">
      <div className="w-full max-w-4xl mx-auto" style={{ maxWidth: "70%" }}>
        <p className="text-center text-2xl font-bold mb-8">Formulario</p>
        <div className="grid gap-4">
          <div>
            <label className="block mb-2 font-medium">Nombres</label>
            <Input
              placeholder="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Apellidos</label>
            <Input
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Foto 1</label>
            <Input placeholder="Foto 1" />
          </div>

          <div>
            <label className="block mb-2 font-medium">Foto 2</label>
            <Input placeholder="Foto 2" />
          </div>

          <div>
            <label className="block mb-2 font-medium">Foto 3</label>
            <Input placeholder="Foto 3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Latitud</label>
              <Input
                placeholder="Latitud"
                value={latitud}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Longitud</label>
              <Input
                placeholder="Longitud"
                value={longitud}
                readOnly
              />
            </div>
          </div>

          <div>
            <Button onClick={handleGuardarDatos} disabled={isSaving} className="mt-4 w-full">
              {isSaving?"Guardando...":"Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
