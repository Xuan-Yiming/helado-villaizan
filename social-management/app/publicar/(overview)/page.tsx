'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, ClockIcon, CameraIcon, VideoCameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import { inter } from '../../ui/fonts';
import Preview from '../../ui/publicar/preview';  // Importa el componente Preview

type NetworkType = 'facebook' | 'instagram' | 'tiktok';

export default function PublicarPage() {
  const [isScheduled, setIsScheduled] = useState(false);
  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [users] = useState([
    { id: 1, name: 'Facebook - Heladería Villaizan', network: 'facebook' as NetworkType },
    { id: 2, name: 'Instagram - @villaizanpaletasartesanales', network: 'instagram' as NetworkType },
    { id: 3, name: 'TikTok - @heladeriavillaizan', network: 'tiktok' as NetworkType },
  ]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('facebook');  // Red seleccionada

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  const handleUserSelect = (id: number, network: NetworkType) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
      setSelectedNetwork(network);
    }
  };

  const handleNetworkChange = (network: NetworkType) => {
    setSelectedNetwork(network);
  };

  return (
    <div className={`${inter.className} flex justify-center p-2 h-full w-full`}>
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden"> {/* Aumenta el max-w para ampliar el contenedor */}
        
        {/* Bloque izquierdo - Configuración de la publicación */}
        <div className="w-full lg:w-3/5 flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-black">Publicar</h1>

          {/* Selección de usuario */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-sm font-semibold text-black">Seleccionar usuarios</h2>
            <ul className="mt-4 space-y-2">
              {users.map(user => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(user.id, user.network)}
                  className={`flex items-center p-2 rounded cursor-pointer text-black ${
                    selectedUsers.includes(user.id)
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-grow">{user.name}</div>
                  {selectedUsers.includes(user.id) && <CheckIcon className="h-5 w-5 text-white" />}
                </li>
              ))}
            </ul>
          </div>

          {/* Área de texto y multimedia */}
          <div className="p-4 border rounded bg-white">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Escribe algo aquí..."
              className="w-full h-32 p-2 border rounded placeholder-gray-500 text-black"
            />
            <div className="flex items-center space-x-4 mt-4">
              <label className="flex items-center cursor-pointer">
                <CameraIcon className="h-6 w-6 text-gray-500" />
                <input type="file" accept="image/*" className="hidden" onChange={handleMediaUpload} />
              </label>
              <label className="flex items-center cursor-pointer">
                <VideoCameraIcon className="h-6 w-6 text-gray-500" />
                <input type="file" accept="video/*" className="hidden" onChange={handleMediaUpload} />
              </label>
            </div>
          </div>

          {/* Seleccionar cuándo publicar */}
          <div className="p-4 border rounded bg-white">
            <h2 className="text-sm font-semibold text-black">Seleccionar cuándo publicar</h2>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setIsScheduled(false)}
                className={`${
                  !isScheduled ? 'bg-blue-500' : 'bg-gray-300'
                } text-white px-4 py-2 rounded flex items-center`}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Ahora
              </button>
              <button
                onClick={() => setIsScheduled(true)}
                className={`${
                  isScheduled ? 'bg-blue-500' : 'bg-gray-300'
                } text-white px-4 py-2 rounded flex items-center`}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Programar
              </button>
            </div>
            {isScheduled && (
              <div className="mt-4">
                <label htmlFor="date" className="block text-sm font-medium text-black">Fecha y hora:</label>
                <input
                  type="datetime-local"
                  id="date"
                  className="p-2 border rounded w-full text-black"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Guardar borrador
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
            Publicar
            </button>
            </div>
        </div>

        {/* Bloque derecho - Vista previa con el componente Preview */}
        <div className="w-full lg:w-2/5 p-4 border rounded bg-gray-50 overflow-hidden">
          {/* Selector de redes sociales */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleNetworkChange('facebook')}
              className={`p-2 rounded ${selectedNetwork === 'facebook' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Facebook
            </button>
            <button
              onClick={() => handleNetworkChange('instagram')}
              className={`p-2 rounded ${selectedNetwork === 'instagram' ? 'bg-pink-500 text-white' : 'bg-gray-300'}`}
            >
              Instagram
            </button>
            <button
              onClick={() => handleNetworkChange('tiktok')}
              className={`p-2 rounded ${selectedNetwork === 'tiktok' ? 'bg-black text-white' : 'bg-gray-300'}`}
            >
              TikTok
            </button>
          </div>

          {/* Componente de vista previa */}
          <Preview text={postText} media={media} selectedNetwork={selectedNetwork} />
        </div>
            
      </div>
    </div>
  );
}
