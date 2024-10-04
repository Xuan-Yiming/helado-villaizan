import React from 'react';
import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, ShareIcon } from '@heroicons/react/24/outline'; // Importamos los íconos en estilo outline

type PreviewProps = {
  text: string;
  media: string | null;
  selectedNetwork: 'facebook' | 'instagram' | 'tiktok';
};

export default function Preview({ text, media, selectedNetwork }: PreviewProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-black">
        Vista previa en {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}:
      </h3>

      {/* Vista previa para Facebook */}
      {selectedNetwork === 'facebook' && (
        <div className="facebook-preview border p-4 rounded bg-white">
          <div className="flex items-center mb-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <span className="font-semibold text-black">Heladería Villaizan</span>
              <p className="text-sm text-gray-500">Just now</p>
            </div>
          </div>
          <p className="text-black mb-4">{text || 'Escribe algo para ver la vista previa...'}</p>
          {media && (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <img src={media} alt="Media" className="max-h-full max-w-full object-cover" />
            </div>
          )}

          {/* Parte inferior - "Me gusta", "Comentar", etc. usando Heroicons outline */}
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

      {/* Vista previa genérica */}
      {selectedNetwork !== 'facebook' && (
        <div>
          <p className="text-black">{text || 'Escribe algo para ver la vista previa...'}</p>
          {media && <img src={media} alt="Media" className="mt-4 w-full h-64 object-contain" />}
        </div>
      )}
    </div>
  );
}
