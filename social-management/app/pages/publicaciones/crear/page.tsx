"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { PutBlobResult } from '@vercel/blob';

import {
  PaperAirplaneIcon,
  ClockIcon,
  CameraIcon,
  VideoCameraIcon,
  CheckIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { MediaFILE, SocialAccount } from "@/app/lib/types";
import { Post } from "@/app/lib/types";

import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import TiktokLogo from "@/app/ui/icons/tiktok";
import Preview from "@/app/ui/publicar/preview";

import { load_all_social_accounts } from "@/app/lib/data";
import { load_post_by_id } from "@/app/lib/data";


function PublicarPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFILE>();
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga

  const [postStatus, setPostStatus] = useState<string>("");

  // Basic data
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<Post>();
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedSocialAccountName, setSelectedSocialAccountName] = useState<string>("");
  // PostDetail
  const [socialMedia, setSocialMedia] = useState<string>("fb");
  const [type, setType] = useState<string>("video");
  const [status, setStatus] = useState<string>("nuevo");
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [media, setMedia] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(undefined);
  const [postTime, setPostTime] = useState<string | undefined>(undefined);
  const [link, setLink] = useState<string | undefined>(undefined);
  const [isProgrammed, setIsProgrammed] = useState<boolean>(false);
  const [programmed_post_time, setPost_time] = useState<string>();

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
            setType(data.tipo);
            setStatus(data.estado);
            setPreview(data.preview);
            setMedia(data.media);
            setContent(data.contenido);
            setPostTime(data.fecha_publicacion);
            setLink(data.link);
            setIsProgrammed(data.is_programmed);
            setPost_time(data.programmed_post_time);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }

    const createNewProgrammedPost = async () => {

      if (searchParams.get("postTime")) {
        setPost_time(searchParams.get("postTime")!);
        setStatus('programado')
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
    if (files && files.length > 0) {
      const file = files[0];

      // Check file size
      const maxSizeInBytes = 4.5 * 1024 * 1024; // 4.5MB
      if (file.size > maxSizeInBytes) {
        alert("El archivo debe ser menor a 4.5MB");
        return;
      }

      const newFile: MediaFILE = {
        id: generateUniqueID(),
        file,
        url: URL.createObjectURL(file),
        type: mediaType,
        name: file.name,
      };

      setMediaFiles(newFile); // Only allow one file to be uploaded

      if (mediaType === "video") {
        setIsVideoSelected(true);
        setIsImageSelected(true); // Disable the option to add images when a video is selected
      } else if (mediaType === "image") {
        setIsImageSelected(true); // Keep the option to add more images activated
      }

      // Reset the input value to allow re-uploading the same file
      event.target.value = ""; // This line ensures the file input is reset
    }
  };

  const handleRemoveMedia = () => {
    setMediaFiles(undefined);
    setIsVideoSelected(false);
    setIsImageSelected(false);
  };



  const handlePost = async () => {
    if (selectedAccount.length === 0) {
      setPostStatus("Por favor, selecciona al menos un usuario para publicar.");
      return;
    }

    setLoading(true);

    try {
      if(mediaFiles){
        const response = await fetch(
          `/api/media/upload?filename=${mediaFiles.name}`,
          {
            method: 'POST',
            body: mediaFiles.file,
          },
        );
        const newBlob = (await response.json()) as PutBlobResult;

        setBlob(newBlob);

        console.log("Response: ", newBlob.url)

        const uploadedMediaURL = newBlob.url

        setMedia(uploadedMediaURL)
        const newPost = {
          id: id,
          text: content,
          media: media,
          status: status,
          isProgrammed: isProgrammed,
          programmed_post_time: programmed_post_time,
          socialAccounts: selectedAccount,
        };
    
        console.log("New Post:", newPost);
      }else{
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
      socialAccounts.find(account => account.red_social.toLowerCase() === socialMedia)?.usuario || ""
    )
  }

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
                {mediaFiles && (
                <div key={mediaFiles.id} className="relative">
                  {mediaFiles.type === "image" ? (
                  <img
                    src={mediaFiles.url}
                    alt={mediaFiles.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  ) : (
                  <video
                    src={mediaFiles.url}
                    className="w-16 h-16 object-cover rounded"
                  />
                  )}
                  <button
                  onClick={handleRemoveMedia}
                  className="absolute top-0 right-0 text-red-500"
                  title="Remove Media"
                  >
                  <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                )}
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
                  onChange={
                    (e) => 
                      {
                        handleMediaUpload(e, "image")
                        setType('image')
                      }

                  }
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
                  onChange={
                    (e) => 
                      {
                        handleMediaUpload(e, "video")
                        setType('video')
                      }

                  }
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
              onClick={() => {
                setStatus("publicado")
                setIsProgrammed(false)
              }}
              className={`${!isProgrammed ? "bg-blue-500" : "bg-gray-300"
                } text-white px-4 py-2 rounded flex items-center`}
              >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Ahora
              </button>
              <button
              onClick={() => {
                setStatus("programado")
                setIsProgrammed(true)
              }}
              className={`${isProgrammed ? "bg-blue-500" : "bg-gray-300"
                } text-white px-4 py-2 rounded flex items-center`}
              >
              <ClockIcon className="h-5 w-5 mr-2" />
              Programar
              </button>
            </div>
            {isProgrammed && (
              <div className="mt-4">
              <label className="block text-black mb-2">Fecha y hora para publicar:</label>
              <input
                type="datetime-local"
                value={programmed_post_time}
                onChange={(e) => setPost_time(e.target.value)}
                className="w-full p-2 border rounded"
                min={new Date().toISOString().slice(0, -8)}
              />
              </div>
            )}
            </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={()=>{
                setStatus("borrador")
                handlePost()
              }}
            >
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
              onClick={() => handleSocialPreviewSelect("facebook")}
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
              onClick={() => handleSocialPreviewSelect("instagram")}
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
              onClick={() => handleSocialPreviewSelect("tiktok")}
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
            text={content? content:""}
            media={mediaFiles ? mediaFiles.url : ""}
            mediaType={mediaFiles ? mediaFiles.type: ""}
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
