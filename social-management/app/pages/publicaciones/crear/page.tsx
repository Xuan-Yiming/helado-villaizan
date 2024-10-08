'use client';

import { useEffect, useState } from 'react';
import { PaperAirplaneIcon, ClockIcon, CameraIcon, VideoCameraIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { inter } from '../../../ui/fonts';
import Preview from '../../../ui/publicar/preview';

type NetworkType = 'facebook' | 'instagram' | 'tiktok';

export default function PublicarPage() {
  const [isScheduled, setIsScheduled] = useState(false);
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<Array<{ id: string; file: File; url: string; type: 'image' | 'video'; name: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga
  const [users] = useState([
    { id: 1, name: 'Facebook - Heladería Villaizan', network: 'facebook' as NetworkType },
    { id: 2, name: 'Instagram - @villaizanpaletasartesanales', network: 'instagram' as NetworkType },
    { id: 3, name: 'TikTok - @heladeriavillaizan', network: 'tiktok' as NetworkType },
  ]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('facebook');
  const [postStatus, setPostStatus] = useState<string>('');

  // Cargar el token de acceso y el ID de la página desde el Local Storage al cargar la página
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('facebookAccessToken');
    const storedPageId = localStorage.getItem('facebookPageId');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedPageId) {
      setPageId(storedPageId);
    }
  }, []);

  const generateUniqueID = () => {
    return `${Date.now()}-${Math.random()}`;
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        id: generateUniqueID(),
        file,
        url: URL.createObjectURL(file),
        type: mediaType,
        name: file.name,
      }));
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter(file => file.id !== id));
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePost = async () => {
    if (!postText && mediaFiles.length === 0) {
      setPostStatus('Completa la publicación');
      return;
    }
  
    if (accessToken && pageId) {
      setLoading(true); // Activar el estado de carga
      const formData = new FormData();
      let endpoint = '';
  
      try {
        // Si hay archivos en el arreglo `mediaFiles`, los añadimos al FormData
        if (mediaFiles.length > 0) {
          // Subir cada archivo por separado si es necesario
          for (const fileData of mediaFiles) {
            const fileFormData = new FormData();
            fileFormData.append('source', fileData.file);
            fileFormData.append('message', postText); // Añadir el mensaje al post si existe
            const isVideo = fileData.type === 'video';
            endpoint = isVideo
              ? `https://graph.facebook.com/${pageId}/videos?access_token=${accessToken}`
              : `https://graph.facebook.com/${pageId}/photos?access_token=${accessToken}`;
  
            const response = await fetch(endpoint, {
              method: 'POST',
              body: fileFormData,
            });
  
            const data = await response.json();
  
            if (!response.ok || !data.id) {
              throw new Error(data.error.message || 'Error desconocido al subir el archivo');
            }
          }
          setPostStatus('¡La publicación se ha realizado con éxito!');
        } else {
          // Si no hay archivo, pero hay mensaje, usar el endpoint de solo texto
          formData.append('message', postText); // Añadir mensaje al post
          endpoint = `https://graph.facebook.com/${pageId}/feed?access_token=${accessToken}`;
  
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
          });
  
          const data = await response.json();
  
          if (response.ok && data.id) {
            setPostStatus('¡La publicación se ha realizado con éxito!');
          } else {
            throw new Error(data.error.message || 'Error desconocido al publicar texto');
          }
        }
      } catch (error) {
        console.error('Error al intentar realizar la publicación:', error);
        if (error instanceof Error) {
          setPostStatus(`Ocurrió un error al publicar en Facebook: ${error.message}`);
        } else {
          setPostStatus('Ocurrió un error desconocido al intentar realizar la publicación.');
        }
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    } else {
      console.log('No access token or page ID available.');
      setPostStatus('No access token or page ID available.');
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
                className={`${!isScheduled ? 'bg-blue-500' : 'bg-gray-300'} text-white px-4 py-2 rounded flex items-center`}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Ahora
              </button>
              <button
                onClick={() => setIsScheduled(true)}
                className={`${isScheduled ? 'bg-blue-500' : 'bg-gray-300'} text-white px-4 py-2 rounded flex items-center`}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Programar
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded">Guardar borrador</button>
            <button
                onClick={handlePost}
                disabled={loading} // Deshabilitar el botón si está cargando
                className={`bg-red-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>

          {/* Mostrar el mensaje de estado de la publicación */}
          {postStatus && (
            <div className="mt-4">
              <p className={`text-sm ${postStatus.includes('éxito') ? 'text-green-600' : 'text-red-600'}`}>{postStatus}</p>
            </div>
          )}
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
            media={mediaFiles.map(file => file.url)}
            mediaType={mediaFiles.length > 0 ? mediaFiles[0].type : null}
            selectedNetwork={selectedNetwork}
          />
        </div>
      </div>
    </div>
  );
}
