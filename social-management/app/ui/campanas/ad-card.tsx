import React from 'react';
import { Ad2 } from '@/app/lib/types';

interface AdCardProps {
  ad: Ad2;
}

export default function AdCard({ ad }: AdCardProps) {
  return (
    <div className="border p-4 rounded-lg flex items-center bg-white shadow-sm">
      {/* Información del anuncio */}
      <div className="flex-1">
        <h2 className="font-bold text-lg">{ad.name || 'Sin título'}</h2>
        <p className="text-sm text-gray-600">
          <strong>ID:</strong> {ad.id}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Estado:</strong> {ad.status}
        </p>
        <p className="text-sm text-gray-600">
          <strong>AdSet ID:</strong> {ad.adset_id}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Creative ID:</strong> {ad.creative.id}
        </p>
      </div>

      {/* Botón de Reanudar */}
      <div className="ml-4">
        <button className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-700">
          Activar
        </button>
      </div>
    </div>
  );
}
