'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { load_addcreatives, load_page_posts } from '@/app/lib/data';

export interface AddCreative {
  id: string;
  name: string;
  effective_object_story_id: string;
}

export interface PostOption {
  id: string;
  picture: string;
  message: string;
}

export default function AddCreativePage() {
  const [addCreatives, setAddCreatives] = useState<
    (AddCreative & { picture?: string; message?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const accountId = '567132785808833'; // ID fijo para la cuenta de anuncios
  const pageId = '443190078883565'; // ID fijo para la página de Facebook

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Cargar AdCreatives y Posts
        const [apiAddCreatives, posts] = await Promise.all([
          load_addcreatives(accountId),
          load_page_posts(pageId),
        ]);

        // Debug: Imprimir posts y AdCreatives
        console.log('Posts:', posts);
        console.log('AdCreatives:', apiAddCreatives);

        // Mapear AddCreatives con información adicional de Posts
        const mappedAddCreatives = apiAddCreatives.map((creative) => {
          const post = posts.find(
            (post) => `${pageId}_${post.id}` === creative.effective_object_story_id
          );

          return {
            ...creative,
            picture: post?.picture || '', // Asigna la imagen si está disponible
            message: post?.message || creative.name, // Usa el mensaje o como fallback el nombre
          };
        });

        // Debug: Imprimir los AdCreatives mapeados
        console.log('Mapped AddCreatives:', mappedAddCreatives);

        setAddCreatives(mappedAddCreatives);
      } catch (error) {
        console.error('Error loading AddCreatives or Posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Todos los AdCreatives</h1>
        <div className="flex items-center">
          <Link
            href="/pages/publicaciones/campanas/addsets/adcreative/crear"
            className="flex items-center ml-5 rounded px-4 py-2 bg-[#BD181E] text-white"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
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
                {/* Título usando el mensaje */}
                <p className="font-bold truncate">{creative.message}</p>
                <span className="text-xs text-gray-500">
                  Story ID: {creative.effective_object_story_id}
                </span>
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

      {/* Loading */}
      {isLoading && (
        <div className="text-center mt-6">
          <p>Cargando AdCreatives...</p>
        </div>
      )}
    </main>
  );
}
