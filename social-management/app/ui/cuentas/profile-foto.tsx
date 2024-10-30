import React from "react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/solid";
import { MediaFILE } from "@/app/lib/types";

interface ProfilePhotoUploadProps {
  mediaFiles: MediaFILE | null;
  setMediaFiles: (mediaFile: MediaFILE | null) => void;
}

const DEFAULT_PROFILE_PHOTO = "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg";

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  mediaFiles,
  setMediaFiles,
}) => {
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
        <button
          type="button"
          onClick={removePhoto}
          className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm flex items-center justify-center"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Quitar la foto
        </button>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;