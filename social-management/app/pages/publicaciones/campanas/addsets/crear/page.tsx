'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { create_adset } from '@/app/lib/data';

function CreateAdsetForm() {
  const [name, setName] = useState('');
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(65);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(['mobile', 'desktop']);
  const [selectedGender, setSelectedGender] = useState(0); // Género inicial: Ambos sexos
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id'); // Obtener campaign_id de la URL

  if (!campaignId) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">
          ID de campaña no especificado. Por favor, vuelve a seleccionar una campaña válida.
        </p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ageMin < 18 || ageMin > ageMax) {
      setError('La edad mínima debe ser mayor o igual a 18 y menor o igual a la edad máxima.');
      return;
    }

    if (selectedPlatforms.length === 0 || selectedDevices.length === 0) {
      setError('Debes seleccionar al menos una plataforma y un dispositivo.');
      return;
    }

    if (!startTime || !endTime || new Date(startTime) >= new Date(endTime)) {
      setError('Debes seleccionar un rango de tiempo válido (endTime debe ser después de startTime).');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const newAdset = {
        name,
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'REACH',
        campaign_id: campaignId,
        promoted_object: { page_id: '443190078883565' }, // Valor fijo
        targeting: {
          facebook_positions: ['feed'],
          geo_locations: { countries: ['PE'] }, // Valor fijo
          genders: [selectedGender], // Género seleccionado
          age_max: ageMax,
          age_min: ageMin,
          publisher_platforms: selectedPlatforms,
          device_platforms: selectedDevices,
        },
        status: 'PAUSED', // Estado fijo
        start_time: startTime,
        end_time: endTime,
      };

      await create_adset(newAdset);
      router.push(`/pages/publicaciones/campanas/addsets?id=${campaignId}`); // Redirigir a los AddSets de la campaña
    } catch (error: any) {
      console.error('Error creando el AddSet:', error);
      setError(error.message || 'Hubo un error al crear el AddSet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleDeviceChange = (device: string) => {
    setSelectedDevices((prev) =>
      prev.includes(device) ? prev.filter((d) => d !== device) : [...prev, device]
    );
  };

  return (
    <main className="p-4 mx-auto sm:w-full lg:w-1/2">
      <h1 className="text-xl font-bold mb-4">Crear Nuevo Adset</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Nombre del Adset */}
        <div>
          <label htmlFor="name" className="block font-medium">
            Nombre del Adset
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Rango de edades */}
        <div className="flex space-x-4">
          <div>
            <label htmlFor="ageMin" className="block font-medium">
              Edad mínima
            </label>
            <input
              type="number"
              id="ageMin"
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
              required
              min={18}
              max={ageMax}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="ageMax" className="block font-medium">
              Edad máxima
            </label>
            <input
              type="number"
              id="ageMax"
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
              required
              min={ageMin}
              max={65}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Selección de género */}
        <div>
          <label htmlFor="genders" className="block font-medium">
            Género
          </label>
          <select
            id="genders"
            value={selectedGender}
            onChange={(e) => setSelectedGender(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value={0}>Ambos sexos</option>
            <option value={1}>Hombres</option>
            <option value={2}>Mujeres</option>
          </select>
        </div>

        {/* Fechas de inicio y fin */}
        <div>
          <label htmlFor="startTime" className="block font-medium">
            Fecha de inicio
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block font-medium">
            Fecha de fin
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Selección de plataformas */}
        <div>
          <label className="block font-medium">Plataformas</label>
          <div className="flex items-center space-x-4">
            {['facebook', 'instagram'].map((platform) => (
              <label key={platform} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                />
                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Selección de dispositivos */}
        <div>
          <label className="block font-medium">Dispositivos</label>
          <div className="flex items-center space-x-4">
            {['mobile', 'desktop'].map((device) => (
              <label key={device} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={device}
                  checked={selectedDevices.includes(device)}
                  onChange={() => handleDeviceChange(device)}
                />
                <span>{device.charAt(0).toUpperCase() + device.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botón de envío */}
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || Boolean(error)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? 'Creando...' : 'Crear Adset'}
        </button>
      </form>
    </main>
  );
}

export default function CreateAdsetPage() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <CreateAdsetForm />
    </Suspense>
  );
}
