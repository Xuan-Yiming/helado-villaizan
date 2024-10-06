import React from 'react';
import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';

type PreviewProps = {
  text: string;
  media: string | null;
  mediaType: 'image' | 'video' | null;  // Añadido para diferenciar el tipo de media
  selectedNetwork: 'facebook' | 'instagram' | 'tiktok';
};

export default function Preview({ text, media, mediaType, selectedNetwork }: PreviewProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-black">
        Vista previa en {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}:
      </h3>

      {/* Vista previa para Facebook */}
      {selectedNetwork === 'facebook' && (
        <div className="facebook-preview border p-4 rounded bg-white max-h-[600px] overflow-y-auto">
          <div className="flex items-center mb-4">
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <span className="font-semibold text-black">Heladería Villaizan</span>
              <p className="text-sm text-gray-500">Just now</p>
            </div>
          </div>
          <p className="text-black mb-4" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {text || 'Escribe algo para ver la vista previa...'}
          </p>

          {/* Renderiza imagen o video según el tipo de media */}
          {media && mediaType === 'image' && (
            <div className="w-full bg-gray-100 flex items-center justify-center">
              <img src={media} alt="Media" className="w-full h-auto object-contain" />
            </div>
          )}




          {media && mediaType === 'video' && (
            <video controls className="w-full h-64 object-contain">
              <source src={media} type="video/mp4" />
              Tu navegador no soporta video.
            </video>
          )}

          {/* Parte inferior - Me gusta, Comentar, Compartir */}
          <div className="flex justify-around items-center border-t pt-4 mt-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <HandThumbUpIcon className="w-6 h-6" />
              <span>Me gusta</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChatBubbleOvalLeftIcon className="w-6 h-6" />
              <span>Comentar</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShareIcon className="w-6 h-6" />
              <span>Compartir</span>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa para Instagram */}
      {selectedNetwork === 'instagram' && (
        <div className="instagram-preview border p-4 rounded bg-white max-h-[600px] overflow-y-auto">
          <div className="flex items-center mb-2">
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <span className="font-semibold text-black">villaizanpaletasartesanales</span>
            </div>
          </div>

          {/* Renderiza imagen o video según el tipo de media */}
          {media && mediaType === 'image' && (
            <img src={media} alt="Media" className="w-full object-contain" />
          )}

          {media && mediaType === 'video' && (
            <video controls className="w-full h-64 object-contain">
              <source src={media} type="video/mp4" />
              Tu navegador no soporta video.
            </video>
          )}

          {/* Parte inferior - Me gusta, Comentar, Compartir */}
          <div className="pt-4">
            <div className="flex justify-between items-center text-gray-500 mb-2">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <HeartIcon className="w-6 h-6" />
                  <span className="text-sm">19.3 mil</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                  <span className="text-sm">33</span>
                </div>
                <div className="flex items-center space-x-1">
                  <PaperAirplaneIcon className="w-6 h-6" />
                  <span className="text-sm">2</span>
                </div>
              </div>
              <div className="flex items-center">
                <BookmarkIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="text-sm text-gray-500" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <span className="font-semibold">@villaizanpaletasartesanales</span> {text || 'Escribe algo para ver la vista previa...'}
            </div>
            <div className="text-sm text-gray-500 mt-2">Ver todos los comentarios</div>
            <div className="text-sm text-gray-500 mt-1">Agrega un comentario...</div>
          </div>
        </div>
      )}
    </div>
  );
}
