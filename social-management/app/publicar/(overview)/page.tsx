'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, ClockIcon, CameraIcon, VideoCameraIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { inter } from '../../ui/fonts';
import Preview from '../../ui/publicar/preview';

type NetworkType = 'facebook' | 'instagram' | 'tiktok';

export default function PublicarPage() {
  const [isScheduled, setIsScheduled] = useState(false);
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<Array<{ id: string; url: string; type: 'image' | 'video'; name: string }>>([]);
  const [users] = useState([
    { id: 1, name: 'Facebook - Heladería Villaizan', network: 'facebook' as NetworkType },
    { id: 2, name: 'Instagram - @villaizanpaletasartesanales', network: 'instagram' as NetworkType },
    { id: 3, name: 'TikTok - @heladeriavillaizan', network: 'tiktok' as NetworkType },
  ]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('facebook');

  // Función para generar un identificador único para cada archivo
  const generateUniqueID = () => {
    return `${Date.now()}-${Math.random()}`;
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        id: generateUniqueID(),  // Asignamos un ID único
        url: URL.createObjectURL(file),
        type: mediaType,
        name: file.name
      }));
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const handleRemoveMedia = (id: string) => {
    // Eliminamos el archivo basado en su ID único
    setMediaFiles(mediaFiles.filter(file => file.id !== id));
  
    // Reseteamos el valor del input para permitir re-subir el mismo archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Limpiamos el valor del input
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
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden">
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

            {/* Mostrar cola de archivos multimedia */}
            <div className="flex items-center space-x-4 mt-4">
              {mediaFiles.map((file) => (
                <div key={file.id} className="relative">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <video src={file.url} className="w-16 h-16 object-cover rounded" />
                  )}
                  <button onClick={() => handleRemoveMedia(file.id)} className="absolute top-0 right-0 text-red-500">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Botones para subir archivos */}
            <div className="flex items-center space-x-4 mt-4">
              <label className="flex items-center cursor-pointer">
                <CameraIcon className="h-6 w-6 text-gray-500" />
                <input type="file" accept="image/*" className="hidden" multiple onChange={(e) => handleMediaUpload(e, 'image')} />
              </label>
              <label className="flex items-center cursor-pointer">
                <VideoCameraIcon className="h-6 w-6 text-gray-500" />
                <input type="file" accept="video/*" className="hidden" multiple onChange={(e) => handleMediaUpload(e, 'video')} />
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
          <Preview
            text={postText}
            media={mediaFiles.map(file => file.url)} // Solo las URLs
            mediaType={mediaFiles.length > 0 ? mediaFiles[0].type : null} // Primer tipo de archivo
            selectedNetwork={selectedNetwork}
          />
        </div>
      </div>
    </div>
  );
}
