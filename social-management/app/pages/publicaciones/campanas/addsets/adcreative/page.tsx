'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { load_addcreatives, load_page_posts } from '@/app/lib/data';
import { AddCreative, PostOption } from '@/app/lib/types';

function AddCreativePageContent() {
  const [addCreatives, setAddCreatives] = useState<AddCreative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const accountId = '567132785808833'; // ID fijo para la cuenta de anuncios
  const pageId = '443190078883565'; // ID fijo de la página

  const loadAddCreatives = async () => {
    setIsLoading(true);
    try {
      const [apiAddCreatives, posts] = await Promise.all([
        load_addcreatives(accountId), // Cargar los AdCreatives
        load_page_posts(pageId), // Cargar los posts de la página
      ]);

      // Combinar los datos de AdCreatives con los posts
      const mappedAddCreatives = apiAddCreatives.map((creative) => ({
        ...creative,
        picture: posts.find(
          (post) => `${pageId}_${post.id}` === creative.effective_object_story_id
        )?.picture || '',
        message: posts.find(
          (post) => `${pageId}_${post.id}` === creative.effective_object_story_id
        )?.message || '',
      }));

      setAddCreatives(mappedAddCreatives);
    } catch (error) {
      console.error('Error loading AddCreatives or Posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddCreatives(); // Cargar todos los AdCreatives y posts al montar el componente
  }, []);

  return (
    <main>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Todos los AdCreatives</h1>
        <div className="flex items-center">
          {/* Botón Crear AddCreative */}
          <Link
            href="/pages/publicaciones/campanas/addsets/adcreative/crear"
            className="flex items-center ml-5 rounded px-4 py-2 bg-[#BD181E] text-white"
          >
            <div>Nuevo</div>
          </Link>
        </div>
      </div>

      {/* Lista de AddCreatives */}
      <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
        {addCreatives.map((creative) => (
          <li
            key={creative.id}
            className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4"
          >
            <div className="flex items-center">
              {/* Imagen del Post */}
              {creative.picture && (
                <img
                  src={creative.picture}
                  alt="Post"
                  className="w-16 h-16 object-cover mr-4 rounded"
                />
              )}
              <div className="flex flex-col">
                <p className="font-bold">{creative.name}</p>
                <span className="text-xs text-gray-500">
                  Story ID: {creative.effective_object_story_id}
                </span>
                {/* Mensaje del Post */}
                {creative.message && (
                  <p className="text-sm text-gray-700 mt-1">{creative.message}</p>
                )}
              </div>
            </div>

            {/* Botón Crear Anuncio */}
            <div className="flex items-center">
              <Link
                href={`/pages/publicaciones/campanas/addsets/adcreative/add?adcreativeId=${creative.id}`}
                className="flex items-center text-blue-500 hover:text-blue-700 ml-5"
              >
                Crear Anuncio
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function AddCreativePage() {
  return (
    <Suspense fallback={<div>Cargando contenido...</div>}>
      <AddCreativePageContent />
    </Suspense>
  );
}
