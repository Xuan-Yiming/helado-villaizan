import React, { useState } from "react";
import Image from "next/image";
import { TrashIcon, DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import { MediaFILE } from "@/app/lib/types";
import { update_profile_photo } from "@/app/lib/database";

interface ProfilePhotoUploadProps {
  mediaFiles: MediaFILE | null;
  setMediaFiles: (mediaFile: MediaFILE | null) => void;
  ifSave?: boolean;
  userID?: string
}

const DEFAULT_PROFILE_PHOTO = "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg";

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  mediaFiles,
  setMediaFiles,
  ifSave,
  userID
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const maxSizeInBytes = 4.5 * 1024 * 1024; // 4.5MB
      if (file.size > maxSizeInBytes) {
        alert("El archivo debe ser menor a 4.5MB");
        return;
      }

      const newFile: MediaFILE = {
        id:"new",
        file,
        url: URL.createObjectURL(file),
        type: "image",
        name: file.name,
      };

      setMediaFiles(newFile);
      event.target.value = "";
    }
  };

  const removePhoto = () => {
    setMediaFiles(null);
  };

  const handleProfileUpdate=  async () =>{
    setIsUploading(true);
    try {
      var photo_url
      if (mediaFiles?.id === "new" && userID) {
        const response = await fetch(
          `/api/media/upload?filename=${mediaFiles.name}`,
          {
            method: "POST",
            body: mediaFiles.file,
          }
        );
        const newBlob = await response.json();
        // //console.log("Uploaded Photo:", newBlob.url);
        photo_url = `${newBlob.url}`;
        // await setUser((user) => ({ ...user, photo: photo_url }));
        // //console.log("Updated User Photo: ", user.photo)
        await update_profile_photo(userID, photo_url);

        const cookie = document.cookie;
        const userInformation = cookie
          .split(";")
          .find((c) => c.trim().startsWith("user="));
          
        if (userInformation) {
          const userValue = userInformation.split("=")[1];
          const user = JSON.parse(decodeURIComponent(userValue));
          user.photo = photo_url;
          document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/`;
          window.location.reload();
        }
      }

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Foto de perfil
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleMediaUpload}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
      />
      <div className="mb-4 flex flex-col items-center">
        <div className="w-60 h-60 rounded-full overflow-hidden border border-gray-300 mb-4 mt-8">
          <Image
            src={mediaFiles?.url || DEFAULT_PROFILE_PHOTO}
            alt="User Photo"
            width={100}
            height={100}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        <div className="flex flex-row">
        <button
          type="button"
          onClick={removePhoto}
          className="mt-2 mr-4 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm flex items-center justify-center"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Quitar la foto
        </button>
        {ifSave && (
          <button
            type="button"
            onClick={handleProfileUpdate}
            className="mt-2 px-4 py-2 bg-[#BD181E] text-white rounded-md shadow-sm flex items-center justify-center"
            disabled={isUploading}
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            {isUploading ? "Actualizando..." : "Actualizar foto"}
          </button>
        ) }
        </div>

      </div>
    </div>
  );
};

export default ProfilePhotoUpload;