import React from 'react';
import Link from 'next/link';

interface AdCreativeCardProps {
  id: string;
  name: string;
  object_story_id: string;
  picture?: string;
  adsetId: string; // Recibe el adsetId como prop
}

export default function AdCreativeCard({ id, name, object_story_id, picture, adsetId }: AdCreativeCardProps) {
  return (
    <div className="border p-4 rounded-lg flex items-center bg-white shadow-sm">
      {/* Imagen del AdCreative */}
      {picture && (
        <img
          src={picture}
          alt={name || 'Sin título'}
          className="w-16 h-16 mr-4 object-cover rounded-lg"
        />
      )}

      {/* Información del AdCreative */}
      <div className="flex-1">
        <h2 className="font-bold text-lg">{name || 'Sin título'}</h2>
        <p className="text-sm text-gray-600">Story ID: {object_story_id}</p>
      </div>

      {/* Botón para Ver Anuncios */}
      <Link
        href={`/pages/publicaciones/campanas/addsets/adcreative/ad?adcreativeId=${id}&adsetId=${adsetId}`}
        className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-700"
      >
        Ver Anuncios
      </Link>
    </div>
  );
}
