"use client";

import { useEffect, useState, Suspense } from "react";
import {
  PaperAirplaneIcon,
  ClockIcon,
  CameraIcon,
  VideoCameraIcon,
  CheckIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { inter } from "@/app/ui/fonts";
import Preview from "@/app/ui/publicar/preview";
// import { handleTiktokPost } from './tiktok-post'; // Importar la función para manejar publicaciones en TikTok
import { useSearchParams } from "next/navigation";


import { SocialAccount } from "@/app/lib/types";
import { Post } from "@/app/lib/types";

import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import TiktokLogo from "@/app/ui/icons/tiktok";

import { load_all_social_accounts } from "@/app/lib/data";
import { load_post_by_id } from "@/app/lib/data";

function PublicarPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [isScheduled, setIsScheduled] = useState(false);
  const [postText, setPostText] = useState("");
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<
    Array<{
      id: string;
      file: File;
      url: string;
      type: "image" | "video";
      name: string;
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga

  const [postStatus, setPostStatus] = useState<string[]>([]);

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<Post>();

  const [post_time, setPost_time] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount[]>([]);

  const getLogo = (name: string) => {
    switch (name) {
      case "Facebook":
        return <FacebookLogo />;
      case "Instagram":
        return <InstagramLogo />;
      case "TikTok":
        return <TiktokLogo />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const socialAccounts = await load_all_social_accounts();
      const filteredSocialAccounts = socialAccounts.filter(
        (account) => account.red_social.toLowerCase() !== "google"
      );
      setSocialAccounts(filteredSocialAccounts);
    };

    const fetchPosts = async () => {
      if(id)
        try {
          const data = await load_post_by_id(id);
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }

    const createNewProgrammedPost = async () => {

      if (searchParams.get("postTime")) {
        setPost_time(searchParams.get("postTime")!);
      }
    }

    fetchData();
    fetchPosts();
    createNewProgrammedPost();
  }, []);

  const generateUniqueID = () => {
    return `${Date.now()}-${Math.random()}`;
  };

  const handleMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaType: "image" | "video"
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        id: generateUniqueID(),
        file,
        url: URL.createObjectURL(file),
        type: mediaType,
        name: file.name,
      }));

      setMediaFiles([...mediaFiles, ...newFiles]);

      if (mediaType === "video") {
        setIsVideoSelected(true);
        setIsImageSelected(true); // Deshabilita la opción de agregar imágenes cuando se selecciona un video
      } else if (mediaType === "image") {
        setIsImageSelected(true); // Mantén la opción de agregar más imágenes activada
      }

      // Reiniciar el valor del input para permitir volver a subir el mismo archivo
      event.target.value = ""; // Esta línea asegura que el input de archivo se restablezca
    }
  };

  const handleRemoveMedia = (id: string) => {
    const fileToRemove = mediaFiles.find((file) => file.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url); // Liberar el objeto URL creado
    }

    const updatedMediaFiles = mediaFiles.filter((file) => file.id !== id);
    setMediaFiles(updatedMediaFiles);

    // Si se eliminan todos los archivos, restablecer los estados de selección
    if (updatedMediaFiles.length === 0) {
      setIsVideoSelected(false);
      setIsImageSelected(false);
    }

    // Resetear el valor del input para que permita volver a subir el mismo archivo
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Esto resetea el valor del input
    }
  };

  const handlePost = async () => {
    if (selectedUsers.length === 0) {
      setPostStatus("Por favor, selecciona al menos un usuario para publicar.");
      return;
    }

    setLoading(true);
    try {
      if (selectedUsers.includes("")) {
        // Publicar en Facebook
      }
      if (selectedUsers.includes(2)) {
        // Publicar en Instagram
      }
      if (selectedUsers.includes(3)) {
        // Aquí se podría agregar la lógica para TikTok
      }
    } catch (error) {
      console.error("Error al intentar realizar la publicación:", error);
      setPostStatus(
        "Ocurrió un error al publicar en la(s) red(es) seleccionada(s)."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (id: string, network: NetworkType) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
      setSelectedNetwork(network);
    }
  };

  const handleNetworkChange = (network: NetworkType) => {
    setSelectedNetwork(network);
  };

  var selectedNetwork = "facebook";
  const handleAccountSelect = (account: SocialAccount) => {
    if (selectedAccount.includes(account)) {
      setSelectedAccount(selectedAccount.filter((acc) => acc !== account));
    } else {
      setSelectedAccount([...selectedAccount, account]);
    }
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
                  {file.type === "image" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveMedia(file.id)}
                    className="absolute top-0 right-0 text-red-500"
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
                className={`flex items-center cursor-pointer ${isVideoSelected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <CameraIcon
                  className={`h-6 w-6 ${isVideoSelected ? "text-gray-300" : "text-gray-500"
                    }`}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => handleMediaUpload(e, "image")}
                  disabled={isVideoSelected} // Deshabilitar si hay un video seleccionado
                />
              </label>
              <label
                className={`flex items-center cursor-pointer ${isImageSelected || isVideoSelected
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
              >
                <VideoCameraIcon
                  className={`h-6 w-6 ${isImageSelected || isVideoSelected
                      ? "text-gray-300"
                      : "text-gray-500"
                    }`}
                />
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload(e, "video")}
                  disabled={isImageSelected || isVideoSelected} // Deshabilitar si hay una imagen o un video seleccionado
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
                onClick={() => setIsScheduled(false)}
                className={`${!isScheduled ? "bg-blue-500" : "bg-gray-300"
                  } text-white px-4 py-2 rounded flex items-center`}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Ahora
              </button>
              <button
                onClick={() => setIsScheduled(true)}
                className={`${isScheduled ? "bg-blue-500" : "bg-gray-300"
                  } text-white px-4 py-2 rounded flex items-center`}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Programar
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Guardar borrador
            </button>
            <button
              onClick={handlePost}
              disabled={loading} // Deshabilitar el botón si está cargando
              className={`bg-red-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>

          {/* Mostrar el mensaje de estado de la publicación */}
          {postStatus && (
            <div className="mt-4">
              <p
                className={`text-sm ${postStatus.includes("éxito")
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
              onClick={() => handleNetworkChange("facebook")}
              className={`p-2 rounded flex items-center
                  ${selectedNetwork === "facebook"
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
              onClick={() => handleNetworkChange("instagram")}
              className={`p-2 rounded flex items-center ${selectedNetwork === "instagram"
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
              onClick={() => handleNetworkChange("tiktok")}
              className={`p-2 rounded flex items-center ${selectedNetwork === "tiktok"
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
            text={postText}
            media={mediaFiles.map((file) => file.url)}
            mediaType={mediaFiles.length > 0 ? mediaFiles[0].type : null}
            selectedNetwork={selectedNetwork}
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
