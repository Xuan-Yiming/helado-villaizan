import React, { useState } from 'react';
import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import Logo from '../../ui/icons/logo-red';

type PreviewProps = {
  text: string;
  media: string; // URLs de los medios (imágenes/videos)
  mediaType: string;
  selectedNetwork: string;
  selectedSocialAccountName:string;
};

export default function Preview({ text, media, mediaType, selectedNetwork, selectedSocialAccountName }: PreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // Controla el índice actual del carrusel

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  const renderMediaForFacebook = () => {
    if (mediaType === 'video') {
        // Renderiza el video correctamente si el mediaType es 'video'
        return (
            <div className="w-full h-auto bg-gray-200 flex items-center justify-center mb-2">
                <video controls className="w-full h-full object-cover">
                    <source src={media[0]} type="video/mp4" />
                    Tu navegador no soporta video.
                </video>
            </div>
        );
    } else if (mediaType === 'image' && media.length === 1) {
        return (
            <div className="w-full h-auto bg-gray-200 flex items-center justify-center mb-2">
                <img src={media[0]} alt="Media" className="w-full h-full object-cover" />
            </div>
        );
    }
};

  return (
    <div>
      <h3 className="font-semibold mb-2 text-black">
        Vista Previa
      </h3>

      {/* Renderizado de la media para Facebook */}
      {selectedNetwork === 'facebook' && (
        <div className="facebook-preview border p-4 rounded bg-white max-h-[600px] overflow-y-auto">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full mr-3 flex items-center justify-center overflow-hidden bg-white">
              <Logo />
            </div>
            <div>
              <span className="font-semibold text-black">{selectedSocialAccountName}</span>
              <p className="text-sm text-gray-500">Just now</p>
            </div>
          </div>
          <p className="text-black mb-4" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {text || 'Escribe algo para ver la vista previa...'}
          </p>
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
        <div className="instagram-preview border p-4 rounded bg-white max-h-[600px] overflow-y-auto relative">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full mr-3 flex items-center justify-center overflow-hidden bg-white">
              <Logo />
            </div>
            <div>
              <span className="font-semibold text-black">{selectedSocialAccountName}</span>
            </div>
          </div>

          {/* Renderiza imagen o video según el tipo de media */}
          {mediaType === 'image' && (
            <div className="relative w-full h-auto">
              <img src={media[currentIndex]} alt="Media" className="w-full object-contain" />
              {media.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full"
                    title="Previous"
                  >
                    <ArrowLeftCircleIcon className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full"
                    title="Next"
                  >
                    <ArrowRightCircleIcon className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          )}

          {mediaType === 'video' && (
            <video controls className="w-full h-64 object-contain">
              <source src={media[0]} type="video/mp4" />
              Tu navegador no soporta video.
            </video>
          )}

          {/* Indicadores del carrusel */}

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
