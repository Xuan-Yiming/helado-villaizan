'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, ClockIcon, CameraIcon, VideoCameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import { inter } from '../../ui/fonts';


export default function PublicarPage() {
  const [isScheduled, setIsScheduled] = useState(false);
  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [users] = useState([
    { id: 1, name: 'Usuario 1' },
    { id: 2, name: 'Usuario 2' },
    { id: 3, name: 'Usuario 3' },
  ]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  const handleUserSelect = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8 flex space-x-8">
        <div className="w-2/3 flex flex-col space-y-4">
          {/* Título dentro del contenedor */}
          <h1 className="text-2xl font-bold text-black">Publicar</h1>

          {/* Selección de usuario */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-sm font-semibold text-black">Seleccionar usuarios</h2>
            <ul className="mt-4 space-y-2">
              {users.map(user => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`flex items-center p-2 rounded border cursor-pointer ${
                    selectedUsers.includes(user.id) ? 'border-red-500 bg-red-100' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-grow">{user.name}</div>
                  {selectedUsers.includes(user.id) && <CheckIcon className="h-5 w-5 text-red-500" />}
                </li>
              ))}
            </ul>
          </div>

          {/* Área de texto y multimedia */}
          <div className="p-4 border rounded bg-white">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full h-32 p-2 border rounded"
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

          {/* Botones de publicar o programar en una fila */}
          <div className="flex space-x-4">
            <button
              onClick={() => setIsScheduled(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Publicar Instantáneamente
            </button>

            <button
              onClick={() => setIsScheduled(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            >
              <ClockIcon className="h-5 w-5 mr-2" />
              Programar Publicación
            </button>
          </div>

          {/* Botones adicionales de guardar y publicar */}
          <div className="flex space-x-4 mt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Guardar borrador
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Publicar
            </button>
          </div>

          {/* Selector de fecha y hora */}
          {isScheduled && (
            <div className="mt-4">
              <label htmlFor="date" className="block mb-2 text-sm font-medium">Fecha y hora:</label>
              <input
                type="datetime-local"
                id="date"
                className="p-2 border rounded w-full"
              />
            </div>
          )}
        </div>

        {/* Vista previa de la publicación */}
        <div className="w-1/3 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Vista previa de la publicación:</h3>
          <p>{postText || 'Escribe algo para ver la vista previa...'}</p>
          {media && <img src={media} alt="Media" className="mt-4 w-full h-64 object-cover" />}
        </div>
      </div>
    </div>
  );
}
