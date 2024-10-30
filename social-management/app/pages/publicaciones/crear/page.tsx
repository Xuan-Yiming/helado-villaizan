"use client";

import { useEffect, useState, Suspense } from "react";
import Image from 'next/image';
import { useSearchParams, useRouter } from "next/navigation";
import type { PutBlobResult } from "@vercel/blob";

import {PaperAirplaneIcon,  ClockIcon,  CameraIcon,  VideoCameraIcon,  CheckIcon,  CheckCircleIcon,  XMarkIcon,} from "@heroicons/react/24/outline";

import { MediaFILE, SocialAccount } from "@/app/lib/types";
import { Post } from "@/app/lib/types";

import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import TiktokLogo from "@/app/ui/icons/tiktok";
import Preview from "@/app/ui/publicar/preview";

import { delete_media_by_url, load_all_social_accounts } from "@/app/lib/database";
import { load_post_by_id } from "@/app/lib/database";
import { create_post } from "@/app/lib/database";

function PublicarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFILE[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga

  const [postStatus, setPostStatus] = useState<string>("");

  // Basic data
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<Post>();
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedSocialAccountName, setSelectedSocialAccountName] =
    useState<string>("");
  // PostDetail
// PostDetail - Estados alineados con el tipo Post
const [socialMedia, setSocialMedia] = useState<string[]>([]); // Es un array
const [type, setType] = useState<string>("video"); 
const [status, setStatus] = useState<string>("publicado"); 
const [thumbnail, setThumbnail] = useState<string | undefined>(undefined); 
const [media, setMedia] = useState<string[] | undefined>(undefined); 
const [content, setContent] = useState<string | undefined>(undefined); 
const [postTime, setPostTime] = useState<string | undefined>(undefined); 

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
  
          console.log("Datos del post cargados:", data);
  
          // Verificamos que cada medio tenga el tipo correcto
          const loadedMediaFiles = (data.media || []).map((url, index) => ({
            id: generateUniqueID(),
            file: null,
            url,
            type: url.endsWith(".mp4") || url.endsWith(".mov") ? "video" : "image", // Verificación del tipo
            name: `media-${index + 1}`,
          }));
  
          setMediaFiles(loadedMediaFiles);
  
          // Ajustamos los estados según el tipo
          if (loadedMediaFiles.some((file) => file.type === "video")) {
            setIsVideoSelected(true);
            setIsImageSelected(true);
          } else if (loadedMediaFiles.length > 0) {
            setIsImageSelected(true);
          }
  
          setPosts(data);
          setSocialMedia(data.social_media || []);
          setType(data.type || "");
          setStatus(data.status || "borrador");
          setThumbnail(data.thumbnail || "");
          setContent(data.content || "");
          setPostTime(formatDateForInput(data.post_time || new Date().toISOString()));
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };
  
    fetchPosts();
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
      const maxSizeInBytes = 4.5 * 1024 * 1024; // 4.5MB
      const newFiles = Array.from(files)
        .map((file) => {
          if (file.size > maxSizeInBytes) {
            alert(`El archivo ${file.name} debe ser menor a 4.5MB`);
            return null; // Ignoramos archivos grandes
          }
          return {
            id: generateUniqueID(),
            file,
            url: URL.createObjectURL(file),
            type: mediaType,
            name: file.name,
          };
        })
        .filter(Boolean) as MediaFILE[];
  
      // Si es un video, sobrescribimos
      if (mediaType === 'video') {
        setMediaFiles([...newFiles]);
        setIsVideoSelected(true);
        setIsImageSelected(true);
      } else {
        // Agregamos imágenes sin sobrescribir las existentes
        setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setIsImageSelected(true);
      }
  
      event.target.value = ''; // Restablecemos el input
    }
  };
  
  const handleRemoveMedia = async (id: string, url: string) => {
    try {
      // Llamada a la API para eliminar el archivo del servicio de Vercel
      const response = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el archivo del servidor.');
      }
  
      console.log(`Archivo con URL ${url} eliminado del servidor.`);
  
      // Llamada a la base de datos para eliminar el registro
      await delete_media_by_url(url);
  
      console.log(`Registro con URL ${url} eliminado de la base de datos.`);
  
      // Eliminar del estado local
      const updatedMediaFiles = mediaFiles.filter((file) => file.id !== id);
      setMediaFiles(updatedMediaFiles);
  
      // Liberar el objeto URL si fue generado localmente
      const fileToRemove = mediaFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
  
      // Restablecer estados si no quedan medios
      if (updatedMediaFiles.length === 0) {
        setIsVideoSelected(false);
        setIsImageSelected(false);
      }
    } catch (error) {
      console.error('Error eliminando el archivo:', error);
      alert('No se pudo eliminar el archivo.');
    }
  };
  
  
  
  

  const handlePost = async () => {
    if (selectedAccount.length === 0) {
      setPostStatus("Por favor, selecciona al menos un usuario para publicar.");
      return;
    }
  
    setLoading(true);
  
    try {
      let uploadedMediaURLs: string[] = []; // Array para almacenar URLs subidas
  
      // Subir archivos multimedia (imágenes o video)
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const maxSizeInBytes = 4.5 * 1024 * 1024; // 4.5MB
  
          // Verificación segura del tamaño del archivo
          if (!file.file || file.file.size > maxSizeInBytes) {
            alert(`El archivo ${file.name} debe ser menor a 4.5MB o es inválido`);
            continue; // Saltamos archivos inválidos
          }
  
          const response = await fetch(
            `/api/media/upload?filename=${file.name}`,
            {
              method: "POST",
              body: file.file,
            }
          );
  
          const newBlob = await response.json();
          console.log("Response:", newBlob.url);
  
          uploadedMediaURLs.push(newBlob.url); // Agregamos la URL al array
        }
  
        setMedia(uploadedMediaURLs); // Ajustamos para ser un array de URLs
      }
  
      // Determinar el tipo del post basado en los archivos subidos
      const postType = mediaFiles.some((file) =>
        file.url.endsWith(".mp4") || file.url.endsWith(".mov")
      )
        ? "video"
        : "image"; // Si hay un video, será "video"; de lo contrario, "image"
  
      // Crear el post para cada cuenta seleccionada
      for (const account of selectedAccount) {
        const newPost: Post = {
          id: id || generateUniqueID(), // Generar ID si no existe
          social_media: [account.red_social], // Ajustamos para ser un array
          type: postType, // Usamos el tipo basado en los archivos subidos
          status,
          thumbnail, // Alineado con el tipo Post
          media: uploadedMediaURLs.length > 0 ? uploadedMediaURLs : undefined, // Si existen URLs
          content,
          post_time: postTime || new Date().toISOString(), // Usamos postTime correctamente
        };
  
        console.log("New Post:", newPost);
        console.log("New Post JSON:", JSON.stringify(newPost));
        await create_post(newPost); // Llamar a la función para crear el post
      }
  
      router.push("/pages/publicaciones"); // Redirigir a publicaciones
    } catch (error) {
      console.error("Error al intentar realizar la publicación:", error);
      setPostStatus(
        "Ocurrió un error al publicar en la(s) red(es) seleccionada(s)."
      );
    } finally {
      setLoading(false);
    }
  };
  
   

  const handleAccountSelect = (account: SocialAccount) => {
    if (selectedAccount.includes(account)) {
      setSelectedAccount(selectedAccount.filter((acc) => acc !== account));
    } else {
      setSelectedAccount([...selectedAccount, account]);
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

  return (
    <div className={`flex justify-center p-2 h-full w-full`}>
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden">
        <div className="w-full lg:w-3/5 flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-black">Publicar</h1>

          {/* Selección de usuario */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-xl font-semibold text-black">
              Seleccionar usuarios
            </h2>
            <ul className="mt-4 space-y-2">
              {socialAccounts.map((account) => (
                <li
                  onClick={() => handleAccountSelect(account)} // Manejar la selección de la cuenta
                  className={`flex items-center p-2 rounded cursor-pointer text-black border border-gray-300 hover:bg-gray-100`}
                >
                  <div className="w-8 h-8 mr-2">
                    {getLogo(account.red_social)}
                  </div>
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
              Contenido de la publicación
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
                    <video
                      src={file.url}
                      className="w-16 h-16 object-cover rounded"
                      controls
                    />
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
                  isVideoSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CameraIcon
                  className={`h-6 w-6 ${
                    isVideoSelected ? 'text-gray-300' : 'text-gray-500'
                  }`}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e, 'image')}
                  disabled={isVideoSelected} // Deshabilitamos si hay video
                />
              </label>

              <label
                className={`flex items-center cursor-pointer ${
                  isImageSelected || isVideoSelected ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <VideoCameraIcon
                  className={`h-6 w-6 ${
                    isImageSelected || isVideoSelected ? 'text-gray-300' : 'text-gray-500'
                  }`}
                />
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e, 'video')}
                  disabled={isImageSelected || isVideoSelected} // Deshabilitamos si hay imagen o video
                />
              </label>
            </div>

          </div>

          {/* Seleccionar cuándo publicar */}
          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold text-black">
              Seleccionar cuándo publicar
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
              onClick={() => {
                setStatus("borrador");
                handlePost();
              }}
            >
              Guardar borrador
            </button>
            <button
              onClick={handlePost}
              disabled={loading} // Deshabilitar el botón si está cargando
              className={`bg-red-500 text-white px-4 py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>

          {/* Mostrar el mensaje de estado de la publicación */}
          {postStatus && (
            <div className="mt-4">
              <p
                className={`text-sm ${
                  postStatus.includes("éxito")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {postStatus}
              </p>
            </div>
          )}
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
            text={content ? content : ""}
            media={mediaFiles ? mediaFiles.url : ""}
            mediaType={mediaFiles ? mediaFiles.type : ""}
            selectedNetwork={selectedNetwork}
            selectedSocialAccountName={selectedSocialAccountName}
          />
        </div>
      </div>
    </div>
  );
}

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
};
