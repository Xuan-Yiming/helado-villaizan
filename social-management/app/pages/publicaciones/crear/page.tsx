"use client";

import { useEffect, useState, Suspense } from "react";
import Image from 'next/image';
import { useSearchParams, useRouter } from "next/navigation";
import type { PutBlobResult } from "@vercel/blob";

import {PaperAirplaneIcon,  ClockIcon,  CameraIcon,  VideoCameraIcon,  CheckIcon,  CheckCircleIcon,  XMarkIcon,} from "@heroicons/react/24/outline";

import { MediaFILE, SocialAccount, Post } from "@/app/lib/types";

import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import TiktokLogo from "@/app/ui/icons/tiktok";
import Preview from "@/app/ui/publicar/preview";

import { delete_media_by_url, load_all_social_accounts } from "@/app/lib/database";
import { load_post_by_id } from "@/app/lib/database";
import { create_post } from "@/app/lib/database";
import { useError } from "@/app/context/errorContext";
import { useConfirmation} from "@/app/context/confirmationContext";
import { useSuccess } from "@/app/context/successContext";

function PublicarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [disableVideo, setDisableVideo] = useState(false); // Controla el botón de video
  const [disableImage, setDisableImage] = useState(false); // Controla el botón de imagen
  const [mediaFiles, setMediaFiles] = useState<MediaFILE[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga

  // Basic data
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<Post>();
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedSocialAccountName, setSelectedSocialAccountName] = useState<string>("");
  const [disableTikTok, setDisableTikTok] = useState(false);
  // PostDetail
  const [originalMediaURLs, setOriginalMediaURLs] = useState<string[]>([]); // URLs originales del backend
  const [socialMedia, setSocialMedia] = useState<string[]>([]); // Es un array
  const [type, setType] = useState<string>("video"); 
  const [status, setStatus] = useState<string>("publicado"); 
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined); 
  const [media, setMedia] = useState<string[] | undefined>(undefined); 
  const [content, setContent] = useState<string | undefined>(undefined); 
  const [postTime, setPostTime] = useState<string | undefined>(undefined); 

  const { showError } = useError();
  const { showSuccess } = useSuccess();
  const { showConfirmation, showAlert } = useConfirmation();


  const getLogo = (name: string) => {
    switch (name.toLowerCase()) {
      case "Facebook".toLowerCase():
        return <FacebookLogo />;
      case "Instagram".toLowerCase():
        return <InstagramLogo />;
      case "TikTok".toLowerCase():
        return <TiktokLogo />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (id) {
        try {
          const data = await load_post_by_id(id);
  
          //console.log("Datos del post cargados:", data);
  
          // Verificamos que cada medio tenga el tipo correcto
          const loadedMediaFiles = (data.media || []).map((url, index) => ({
            id: generateUniqueID(),
            file: null,
            url,
            type: url.endsWith(".mp4") || url.endsWith(".mov") ? "video" : "image", // Verificación del tipo
            name: `media-${index + 1}`,
          }));
  
          setMediaFiles(loadedMediaFiles);
          // Guardamos las URLs originales en el estado
          setOriginalMediaURLs(data.media || []);
          
          // Ajustamos los estados según el tipo
          if (loadedMediaFiles.some((file) => file.type === "video")) {
            setDisableImage(true);  // Deshabilitar botón de imagen
            setDisableVideo(true);  // Deshabilitar botón de video también
          } else if (loadedMediaFiles.length > 0) {
            setDisableVideo(true); // Deshabilitar solo video al subir imágenes
            setDisableTikTok(true);
          }
  
          setPosts(data);
          setSocialMedia(data.social_media || []);
          setType(data.type || "");
          setStatus(data.status || "borrador");
          setThumbnail(data.thumbnail || "");
          setContent(data.content || "");
          setPostTime(formatDateForInput(data.post_time || new Date().toISOString()));
        } catch (error) {
          showError("Error fetching posts: " + error);
        }
      }
    };

    const fetchSocialAccounts = async () => {
      try {
        const socialAccounts = await load_all_social_accounts(); // Llamada a la BD
        const filteredSocialAccounts = socialAccounts.filter(
          (account) => account.red_social.toLowerCase() !== "google" // Filtro de Google
        );
        setSocialAccounts(filteredSocialAccounts); // Actualizamos el estado con las cuentas filtradas
      } catch (error) {
        showError("Error fetching social accounts:" + error);
      }
    };
  
    fetchPosts();
    fetchSocialAccounts(); 

  }, [id, searchParams]);  
  
  const generateUniqueID = () => {
    return `${Date.now()}-${Math.random()}`;
  };

  const handleMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaType: 'image' | 'video'
  ) => {
    const files = event.target.files;
  
    if (files) {
      const maxSizeInBytes = 4.0 * 1024 * 1024; // 4.0MB para ambos tipos
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/jfif']; // Tipos permitidos para imágenes
  
      const newFiles = Array.from(files)
        .map((file) => {
          if (mediaType === 'image') {
            // Verificar formato de imagen
            if (!allowedImageTypes.includes(file.type)) {
              showAlert(`El archivo ${file.name} no es un formato de imagen permitido.`,() => {});
              return null;
            }
          }
  
          // Verificar tamaño del archivo (4MB máximo)
          if (file.size > maxSizeInBytes) {
            showAlert(`El archivo ${file.name} debe ser menor a 4.0MB.`,() => {});
            return null;
          }
  
          // Retornar objeto del archivo si pasa las validaciones
          return {
            id: generateUniqueID(),
            file,
            url: URL.createObjectURL(file),
            type: mediaType,
            name: file.name,
          };
        })
        .filter(Boolean) as MediaFILE[];
  
      // Solo actualizar `mediaFiles` y `disableTikTok` si los archivos pasaron las validaciones
      if (newFiles.length > 0) {
        // Lógica para manejar imágenes
        if (mediaType === 'image') {
          const totalImages =
            mediaFiles.filter((file) => file.type === 'image').length + newFiles.length;
  
          if (totalImages > 10) {
            showAlert('No puedes subir más de 10 imágenes.',() => {});
            event.target.value = ''; // Restablecer input
            return;
          }
  
          setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
          setDisableVideo(true); // Deshabilitar videos al subir imágenes válidas
          setDisableTikTok(true); // Deshabilitar TikTok si hay imágenes válidas
        }
        // Lógica para manejar videos
        else if (mediaType === 'video') {
          setMediaFiles([...newFiles]);
          setDisableImage(true); // Deshabilitar imágenes
          setDisableVideo(true); // Deshabilitar más videos
        }
      }
  
      event.target.value = ''; // Restablecer input
    }
  };
  
  
  const handleRemoveMedia = async (id: string, url: string) => {
    try {
      // Verificar si la URL es parte de las originales y eliminar del servidor
      if (originalMediaURLs.includes(url)) {
        const response = await fetch('/api/media/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
  
        if (!response.ok) {
          throw new Error('Error al eliminar el archivo del servidor.');
        }
        //console.log(`Archivo con URL ${url} eliminado del servidor.`);
  
        await delete_media_by_url(url);
        //console.log(`Registro con URL ${url} eliminado de la base de datos.`);
      }
  
      // Actualizar la lista de archivos locales
      const updatedMediaFiles = mediaFiles.filter((file) => file.id !== id);
      setMediaFiles(updatedMediaFiles);
  
      const hasVideo = updatedMediaFiles.some((file) => file.type === 'video');
      const hasImage = updatedMediaFiles.some((file) => file.type === 'image');
  
      // Verificar si TikTok sigue seleccionado
      const isTikTokSelected = selectedAccount.some(
        (account) => account.red_social.toLowerCase() === 'tiktok'
      );
  
      // Restablecer estados según los archivos restantes y selección de TikTok
      if (!hasVideo) {
        setDisableVideo(hasImage); // Deshabilitar videos si quedan imágenes
        setDisableImage(isTikTokSelected || hasVideo); // Deshabilitar imágenes si TikTok sigue seleccionado o si hay videos
      }
  
      setDisableTikTok(hasImage); // Deshabilitar TikTok si quedan imágenes
  
      // Liberar la URL si fue generada localmente
      const fileToRemove = mediaFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
    } catch (error) {
      showAlert('No se pudo eliminar el archivo.',() => {});
    }
  };

  const handlePost = async (statusOverride?: string) => {
    const currentStatus = statusOverride || status; // Usar el estado pasado o el actual
    //console.log("Estado de publicación:", currentStatus); // Confirmar el estado
    
    const isValid = validatePost(selectedAccount, mediaFiles, currentStatus, postTime, content);

    if (!isValid) {
      return;
    }
  
    setLoading(true);
  
    try {
      let uploadedMediaURLs: string[] = [];
      let successNetworks: string[] = []; // Redes sociales con publicación exitosa
  
      // Subir archivos multimedia
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const maxSizeInBytes = 4.0 * 1024 * 1024;
  
          if (!file.file || file.file.size > maxSizeInBytes) {
            showAlert(`El archivo ${file.name} debe ser menor a 4.0MB o es inválido`,() => {});
            continue;
          }
  
          const response = await fetch(`/api/media/upload?filename=${file.name}`, {
            method: 'POST',
            body: file.file,
          });
  
          const newBlob = await response.json();
          uploadedMediaURLs.push(newBlob.url);
        }
  
        setMedia(uploadedMediaURLs);
      }
  
      const postType = mediaFiles.some((file) => file.type === 'video') ? 'video' : 'image';
  
      for (const account of selectedAccount) {
        const newPost: Post = {
          id: id || generateUniqueID(),
          social_media: [account.red_social],
          type: postType,
          status: currentStatus, // Usar el estado correcto
          thumbnail: uploadedMediaURLs.length > 0 ? uploadedMediaURLs[0] : undefined,
          media: uploadedMediaURLs.length > 0 ? uploadedMediaURLs : undefined,
          content,
          post_time: postTime || new Date().toISOString(),
        };
  
        // Solo guarda el post si el estado es "borrador"
        await create_post(newPost);

        // Si el estado no es "borrador", intenta publicar en la API de redes sociales
        if (currentStatus !== "borrador" && (currentStatus === "publicado" || (currentStatus === "programado" && account.red_social.toLowerCase() === "facebook"))) {
          const success = await publishToSocialMedia(account.red_social, newPost);
          if (success) {
            successNetworks.push(account.red_social);
          }
        }
      }
  
      if (successNetworks.length > 0) {
        showSuccess(
          `La publicación se ha realizado correctamente en: ${successNetworks.join(' - ')}`
        );
      } else if (currentStatus !== "borrador" && currentStatus !== "programado") {
        showAlert('No se pudo realizar la publicación en ninguna red social.',() => {});
      } else if(currentStatus =="borrador"){
        showSuccess('El borrador se ha guardado correctamente.');
      } else if(currentStatus =="programado"){
        showSuccess('Se ha programado correctamente.');  
      }
    } catch (error) {
      console.error('Error al intentar realizar la publicación:', error);
      showAlert('Ocurrió un error al publicar en la(s) red(es) seleccionada(s).',() => {});
    } finally {
      setLoading(false);
      setSelectedAccount([]);
    }
  };
  
  const handleAccountSelect = (account: SocialAccount) => {
    const isTikTok = account.red_social.toLowerCase() === 'tiktok';
  
    if (selectedAccount.includes(account)) {
      const updatedAccounts = selectedAccount.filter((acc) => acc !== account);
      setSelectedAccount(updatedAccounts);
  
      // Si se deselecciona TikTok, verificar si se deben habilitar imágenes.
      // No habilitar imágenes si ya hay un video en los archivos subidos.
      if (isTikTok && !mediaFiles.some((file) => file.type === 'video')) {
        setDisableImage(false); 
      }
    } else {
      setSelectedAccount([...selectedAccount, account]);
  
      // Si se selecciona TikTok, deshabilitar imágenes.
      if (isTikTok) {
        setDisableImage(true);
      }
    }
  };
  
  const handleSocialPreviewSelect = (socialMedia: string) => {
    setSelectedNetwork(socialMedia);
    setSelectedSocialAccountName(
      socialAccounts.find(
        (account) => account.red_social.toLowerCase() === socialMedia
      )?.usuario || ""
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const formattedDate = date.toISOString();
    setPostTime(formattedDate);
  };

  function validatePost(
    selectedAccount: any[],
    mediaFiles: MediaFILE[],
    status: string,
    postTime?: string,
    content?: string
  ): boolean {
    const hasInstagram = selectedAccount.some(
      (account) => account.red_social.toLowerCase() === 'instagram'
    );
  
    const hasTikTok = selectedAccount.some(
      (account) => account.red_social.toLowerCase() === 'tiktok'
    );
  
    if ((hasInstagram || hasTikTok) && (!mediaFiles || mediaFiles.length === 0)) {
      showAlert('Debes adjuntar al menos una imagen o video para publicar en la red social seleccionada.',() => {});
      return false;
    }
  
    if (selectedAccount.length === 0) {
      showAlert('Por favor, selecciona al menos un usuario para publicar.',() => {});
      return false;
    }
  
    if (status === 'programado') {
      if (!postTime) {
        showAlert('Por favor, selecciona una fecha y hora válidas.',() => {});
        return false;
      }
  
      const currentDate = new Date();
      const scheduledDate = new Date(postTime);
      const minValidDate = new Date(currentDate.getTime() + 10 * 60 * 1000);
  
      if (scheduledDate < minValidDate) {
        showAlert('La fecha/hora programada debe ser al menos 10 minutos en el futuro.',() => {});
        return false;
      }
  
      if (scheduledDate < currentDate) {
        showAlert('No puedes programar una publicación en una fecha pasada.',() => {});
        return false;
      }
    }
  
    if (!content?.trim() && mediaFiles.length === 0) {
      showAlert('Debe haber al menos un archivo o contenido para publicar.',() => {});
      return false;
    }
  
    return true;
  }

  return (
    <div className={`flex justify-center p-2 h-full w-full`}>
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden">
        <div className="w-full lg:w-3/5 flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-black">Publicar</h1>

          {/* Selección de usuario */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-xl font-semibold text-black">
              Selecciona las cuentas:
            </h2>
            <ul className="mt-4 space-y-2">
              {socialAccounts.map((account) => (
                <li
                  key={account.red_social}
                  onClick={() =>
                    !disableTikTok || account.red_social.toLowerCase() !== 'tiktok'
                      ? handleAccountSelect(account)
                      : null
                  }
                  className={`flex items-center p-2 rounded cursor-pointer text-black border border-gray-300 hover:bg-gray-100 ${
                    account.red_social.toLowerCase() === 'tiktok' && disableTikTok
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="w-8 h-8 mr-2">{getLogo(account.red_social)}</div>
                  <div className="flex-grow">{account.usuario}</div>
                  {selectedAccount.includes(account) && (
                    <CheckCircleIcon className="h-5 w-5 text-[#BD181E]" />
                  )}
                </li>
              ))}
            </ul>

          </div>

          {/* Área de texto y multimedia */}
          <div className="p-4 border rounded bg-white ">
            <h2 className="text-xl font-semibold text-black mb-4">
              Ingresa el contenido de la publicación:
            </h2>
            {/* Contenido */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe algo aquí..."
              className="w-full h-32 p-2 border rounded placeholder-gray-500 text-black"
            />

            {/* Mostrar cola de archivos multimedia */}
            <div className="flex items-center space-x-4 mt-4">
              {mediaFiles.map((file) => (
                <div key={file.id} className="relative">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <video src={file.url} className="w-16 h-16 object-cover rounded" />
                  )}
                  <button
                    onClick={() => handleRemoveMedia(file.id, file.url)}
                    className="absolute top-0 right-0 m-1 text-red-500 bg-white rounded-full p-1"
                    title="Remove Media"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Botones para subir archivos */}
            <div className="flex items-center space-x-4 mt-4">
              <label
                className={`flex items-center cursor-pointer ${
                  disableImage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CameraIcon
                  className={`h-6 w-6 ${
                    disableImage ? 'text-gray-300' : 'text-gray-500'
                  }`}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e, 'image')}
                  disabled={disableImage}
                />
              </label>

              <label
                className={`flex items-center cursor-pointer ${
                  disableVideo ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <VideoCameraIcon
                  className={`h-6 w-6 ${
                    disableVideo ? 'text-gray-300' : 'text-gray-500'
                  }`}
                />
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e, 'video')}
                  disabled={disableVideo}
                />
              </label>
            </div>
          </div>

          {/* Seleccionar cuándo publicar */}
          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold text-black">
              Realiza la publicación:
            </h2>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setStatus("publicado")}
                className={`${
                  status === "publicado" ? "bg-blue-500" : "bg-gray-300"
                } text-white px-4 py-2 rounded flex items-center`}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Ahora
              </button>
              <button
                id="bt_programar"
                onClick={() => setStatus("programado")}
                className={`${
                  status === "programado" ? "bg-blue-500" : "bg-gray-300"
                } text-white px-4 py-2 rounded flex items-center`}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Programar
              </button>
            </div>

            {/* Mostrar campo de fecha solo si el estado es 'programado' */}
            {status === "programado" && (
              <div className="mt-4">
                <label className="block text-black mb-2">
                  Fecha y hora para publicar:
                </label>
                <input
                  type="datetime-local"
                  value={postTime}
                  onChange={(e) => setPostTime(e.target.value)}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().slice(0, -8)}
                />
              </div>
            )}
          </div>

        
          <div className="flex justify-end space-x-4 mt-4">
          <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => handlePost("borrador")}
            >
              Guardar borrador
            </button>
            <button
              onClick={() => handlePost(status === "programado" ? "programado" : "publicado")}
              disabled={loading} // Deshabilitar el botón si está cargando
              className={`bg-red-500 text-white px-4 py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>

        </div>

        {/* Bloque derecho - Vista previa con el componente Preview */}
        <div className="w-full lg:w-2/5 p-4 border rounded bg-gray-50 overflow-hidden">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleSocialPreviewSelect("facebook")}
              className={`p-2 rounded flex items-center
                  ${
                    selectedNetwork === "facebook"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
            >
              <div className="w-6 h-6 mr-2">
                <FacebookLogo />
              </div>
              Facebook
            </button>
            <button
              onClick={() => handleSocialPreviewSelect("instagram")}
              className={`p-2 rounded flex items-center ${
                selectedNetwork === "instagram"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              <div className="w-6 h-6 mr-2">
                <InstagramLogo />
              </div>
              Instagram
            </button>
            <button
              onClick={() => handleSocialPreviewSelect("tiktok")}
              className={`p-2 rounded flex items-center ${
                selectedNetwork === "tiktok"
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
            >
              <div className="w-6 h-6 mr-2">
                <TiktokLogo />
              </div>
              TikTok
            </button>
          </div>

          {/* Componente de vista previa */}
          <Preview
          text={content || ""}
          media={mediaFiles.map((file) => file.url)} // Pasa un array de URLs
          mediaType={mediaFiles.length > 0 && (mediaFiles[0].type === 'video' || mediaFiles[0].type === 'image') 
            ? mediaFiles[0].type 
            : null}
          selectedNetwork={isValidNetwork(selectedNetwork) ? selectedNetwork : 'facebook'} // Default to 'facebook'
        />
        </div>
      </div>
    </div>
  );
}

const isValidNetwork = (network: string): network is 'facebook' | 'instagram' | 'tiktok' =>
  ['facebook', 'instagram', 'tiktok'].includes(network);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PublicarPage />
    </Suspense>
  );
}

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const publishToSocialMedia = async (network: string, post: Post): Promise<boolean> => {
  try {
    const response = await fetch(`/api/${network.toLowerCase()}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error al publicar en ${network}:`, errorData);
      return false; // Retorna false si hay un error
    }

    const data = await response.json();
    // //console.log(`Publicado en ${network} con éxito. ID: ${data.postId}`);
    return true; // Retorna true si la publicación es exitosa
  } catch (error) {
    console.error(`Error al publicar en ${network}:`, error);
    return false; // Retorna false si ocurre una excepción
  }
};


