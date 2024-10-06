import React from 'react';
import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';

type PreviewProps = {
  text: string;
  media: string[]; // URLs de los medios (imágenes/videos)
  mediaType: 'image' | 'video' | null;
  selectedNetwork: 'facebook' | 'instagram' | 'tiktok';
};

export default function Preview({ text, media, mediaType, selectedNetwork }: PreviewProps) {
  
  const renderMediaForFacebook = () => {
    if (media.length === 1) {
      return (
        <div className="w-full h-auto bg-gray-200 flex items-center justify-center mb-2">
          <img src={media[0]} alt="Media" className="w-full h-full object-cover" />
        </div>
      );
    }

    if (media.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {media.slice(0, 2).map((item, index) => (
            <img key={index} src={item} alt={`Media ${index}`} className="w-full h-full object-cover" />
          ))}
        </div>
      );
    }

    if (media.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <img src={media[0]} alt="Media 0" className="col-span-2 w-full h-full object-cover" />
          <img src={media[1]} alt="Media 1" className="w-full h-full object-cover" />
          <img src={media[2]} alt="Media 2" className="w-full h-full object-cover" />
        </div>
      );
    }

    if (media.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {media.slice(0, 4).map((item, index) => (
            <img key={index} src={item} alt={`Media ${index}`} className="w-full h-full object-cover" />
          ))}
        </div>
      );
    }

    if (media.length === 5) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {/* Primera fila con dos imágenes */}
          <div className="grid grid-cols-2 gap-2 col-span-2">
            <img src={media[0]} alt="Media 0" className="w-full h-60 object-cover" />
            <img src={media[1]} alt="Media 1" className="w-full h-60 object-cover" />
          </div>
          {/* Segunda fila con tres imágenes */}
          <div className="grid grid-cols-3 gap-2 col-span-2">
            {media.slice(2, 5).map((item, index) => (
              <img key={index} src={item} alt={`Media ${index + 2}`} className="w-full h-40 object-cover" />
            ))}
          </div>
        </div>
      );
    }

    if (media.length > 5) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {/* Primera fila con dos imágenes */}
          <div className="grid grid-cols-2 gap-2 col-span-2">
            <img src={media[0]} alt="Media 0" className="w-full h-60 object-cover" />
            <img src={media[1]} alt="Media 1" className="w-full h-60 object-cover" />
          </div>
          {/* Segunda fila con tres imágenes */}
          <div className="grid grid-cols-3 gap-2 col-span-2">
            {media.slice(2, 4).map((item, index) => (
              <img key={index} src={item} alt={`Media ${index + 2}`} className="w-full h-40 object-cover" />
            ))}
            {/* Última imagen con el contador */}
            <div className="relative w-full h-40 bg-gray-300">
              <img src={media[4]} alt="Media 4" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-3xl font-bold">
                +{media.length - 5}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2 text-black">
        Vista previa en {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}:
      </h3>

      {/* Renderizado de la media para Facebook */}
      {selectedNetwork === 'facebook' && (
        <div className="facebook-preview border p-4 rounded bg-white max-h-[600px] overflow-y-auto">
          {renderMediaForFacebook()}

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

      {/* Renderizado de la media para Instagram */}
      {selectedNetwork === 'instagram' && (
        <div className="instagram-preview border p-4 rounded bg-white max-h-[600px] overflow-y-auto">
          <div className="flex items-center mb-2">
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <span className="font-semibold text-black">villaizanpaletasartesanales</span>
            </div>
          </div>

          {/* Renderiza imagen o video según el tipo de media */}
          {mediaType === 'image' && (
            <img src={media[0]} alt="Media" className="w-full object-contain" />
          )}

          {mediaType === 'video' && (
            <video controls className="w-full h-64 object-contain">
              <source src={media[0]} type="video/mp4" />
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
