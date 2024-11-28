'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { create_adcreative, load_page_posts } from '@/app/lib/data';

interface PostOption {
  id: string;
  picture: string;
  message?: string;
}

function CreateAdCreativeForm() {
  const [name, setName] = useState('');
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const adsetId = searchParams.get('adsetId'); // Obtener `adsetId` de la URL
  const pageId = '443190078883565'; // ID fijo de la página
  const fixedLinkUrl = 'https://www.facebook.com/@VillaizanArtesanal/'; // Enlace fijo

  // Validar si `adsetId` está presente
  useEffect(() => {
    if (!adsetId) {
      setError('ID de AdSet no encontrado en la URL. Por favor, verifica e inténtalo de nuevo.');
    }
  }, [adsetId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await load_page_posts(pageId);
        setPosts(fetchedPosts);
        setSelectedPost(fetchedPosts.length > 0 ? fetchedPosts[0].id : null);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Error al cargar los posts de la página.');
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !selectedPost) {
      setError('Debes completar todos los campos.');
      return;
    }

    if (!adsetId) {
      setError('No se puede proceder sin un ID de AdSet válido.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const objectStoryId = selectedPost; // Usar directamente el ID completo del post
      const newAdCreative = {
        name,
        object_story_id: objectStoryId,
        link_url: fixedLinkUrl,
        call_to_action: {
          type: 'LEARN_MORE',
          value: {
            link: fixedLinkUrl,
          },
        },
      };

      console.log('Creating AdCreative with:', newAdCreative);

      await create_adcreative(newAdCreative);

      // Redirigir y conservar el adsetId en la URL
      router.replace(`/pages/publicaciones/campanas/addsets/adcreative?adsetId=${adsetId}`);
    } catch (error: any) {
      console.error('Error creando el AdCreative:', error);
      setError(error.message || 'Hubo un error al crear el AdCreative.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!adsetId) {
    return (
      <div className="p-4 mx-auto sm:w-full lg:w-1/2">
        <h1 className="text-xl font-bold mb-4">Crear Nuevo AdCreative</h1>
        <p className="text-red-500">
          No se encontró el ID de AdSet en la URL. Por favor, regresa y selecciona un AdSet válido.
        </p>
      </div>
    );
  }

  return (
    <main className="p-4 mx-auto sm:w-full lg:w-1/2">
      <h1 className="text-xl font-bold mb-4">Crear Nuevo AdCreative</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Nombre del AdCreative */}
        <div>
          <label htmlFor="name" className="block font-medium">
            Nombre del AdCreative
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

        {/* Selección de Post */}
        <div>
          <label htmlFor="post" className="block font-medium">
            Selecciona un Post
          </label>
          <select
            id="post"
            value={selectedPost || ''}
            onChange={(e) => setSelectedPost(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.message || 'Sin mensaje'}
              </option>
            ))}
          </select>
        </div>

        {/* Vista previa de la imagen del post */}
        {selectedPost && (
          <div className="mt-4">
            <p className="font-medium">Vista previa del Post:</p>
            <img
              src={posts.find((post) => post.id === selectedPost)?.picture || ''}
              alt="Vista previa del post"
              className="w-full h-auto mt-2 border rounded"
            />
            {/* Mostrar ID del post debajo de la imagen */}
            <p className="text-sm text-gray-600 mt-2">
              <strong>ID del Post:</strong> {selectedPost}
            </p>
          </div>
        )}

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={isLoading || !adsetId}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? 'Creando...' : 'Crear AdCreative'}
        </button>
      </form>
    </main>
  );
}

export default function CreateAdCreativePageWrapper() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <CreateAdCreativeForm />
    </Suspense>
  );
}