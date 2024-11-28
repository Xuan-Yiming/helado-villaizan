'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { create_adcreative, load_page_posts } from '@/app/lib/data';

interface PostOption {
  id: string;
  picture: string;
  message?: string;
}

export default function CreateAdCreativePage() {
  const [name, setName] = useState('');
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pageId = '443190078883565'; // Página fija
  const fixedLinkUrl = 'https://www.facebook.com/@VillaizanArtesanal/'; // Enlace fijo

  // Cargar posts desde la API
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

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedPost) {
      setError('Debes completar todos los campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const objectStoryId = `${pageId}_${selectedPost}`; // ID compuesto con el formato correcto
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

      await create_adcreative(newAdCreative);
      router.push('/pages/publicaciones/campanas/addsets/adcreative');
    } catch (error: any) {
      console.error('Error creando el AdCreative:', error);
      setError(error.message || 'Hubo un error al crear el AdCreative.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 mx-auto sm:w-full lg:w-1/2">
      <h1 className="text-xl font-bold mb-4">Crear Nuevo AdCreative</h1>
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
          </div>
        )}

        {/* Mostrar errores */}
        {error && <p className="text-red-500">{error}</p>}
        
        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? 'Creando...' : 'Crear AdCreative'}
        </button>
      </form>
    </main>
  );
}
