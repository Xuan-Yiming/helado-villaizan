'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { create_ad } from '@/app/lib/data';

function CreateAdContent() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('PAUSED');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const addSetId = searchParams.get('adsetId');
  const adCreativeId = searchParams.get('adcreativeId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !addSetId || !adCreativeId) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const newAd = {
        name,
        adset_id: addSetId,
        creative: { creative_id: adCreativeId },
        status,
      };

      await create_ad(newAd);
      router.push(`/pages/publicaciones/campanas/addsets/adcreative/ad?adcreativeId=${adCreativeId}&adsetId=${addSetId}`);
    } catch (error: any) {
      console.error('Error creando el anuncio:', error);
      setError(error.message || 'Hubo un error al crear el anuncio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 mx-auto sm:w-full lg:w-1/2">
      <h1 className="text-xl font-bold mb-4">Crear Nuevo Anuncio</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Nombre del Anuncio
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

        <div>
          <label htmlFor="status" className="block font-medium">
            Estado del Anuncio
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="PAUSED">Pausado</option>
            <option value="ACTIVE">Activo</option>
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? 'Creando...' : 'Crear Anuncio'}
        </button>
      </form>

      {/* Mostrar parámetros como texto informativo */}
      {addSetId && adCreativeId && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <p className="text-sm text-gray-700">
            <strong>AdSet ID:</strong> {addSetId}
          </p>
          <p className="text-sm text-gray-700">
            <strong>AdCreative ID:</strong> {adCreativeId}
          </p>
        </div>
      )}
    </main>
  );
}

export default function CreateAdPage() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <CreateAdContent />
    </Suspense>
  );
}
