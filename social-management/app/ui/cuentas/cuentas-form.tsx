import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import { MediaFILE, UserAccount } from "@/app/lib/types";
import ProfilePhotoUpload from "./profile-foto";
import FormField from "../components/form-item";
import { createOrUpdateUserAccount, is_email_available } from "@/app/lib/database";
import { check_password_requirement } from "@/app/lib/actions";

const DEFAULT_PROFILE_PHOTO =
  "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg";

interface CuentasFormProps {
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
}

const CuentasForm: React.FC<CuentasFormProps> = ({ user, setUser }) => {
  const router = useRouter();
  const [mediaFiles, setMediaFiles] = useState<MediaFILE | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!check_password_requirement(user.password, user.password)) {
      return;
    }

    if (!is_email_available(user.username)) {
      return;
    }

    setIsUploading(true);

    console.log("mediaFiles: ", mediaFiles);
    

    try {
      var photo_url = user.photo
      if (mediaFiles?.id === "new") {
        const response = await fetch(
          `/api/media/upload?filename=${mediaFiles.name}`,
          {
            method: "POST",
            body: mediaFiles.file,
          }
        );
        const newBlob = await response.json();
        console.log("Uploaded Photo:", newBlob.url);
        photo_url = `${newBlob.url}`;
        // await setUser((user) => ({ ...user, photo: photo_url }));
        // console.log("Updated User Photo: ", user.photo)
      }else if(!mediaFiles){
        photo_url = DEFAULT_PROFILE_PHOTO
      }

      await createOrUpdateUserAccount({ ...user, photo: photo_url });
      router.push("/pages/cuentas/empleados");
      console.log("Form submitted:", user);
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setMediaFiles({
      id: Math.random().toString(36).substr(2, 9),
      file: new File([], "default.jpg"),
      url: user.photo!,
      type: "image",
      name: "",
    });
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col lg:flex-row">
      {/* profile */}
      <div className="w-1/3">
        <ProfilePhotoUpload
          mediaFiles={mediaFiles}
          setMediaFiles={setMediaFiles}
        />
      </div>
      {/* form */}
      <div className="w-2/3 pl-4">
        <FormField
          label="Usuario"
          type="email"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
        />
        <FormField
          label="Contraseña"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <FormField
          label="Nombre"
          type="text"
          value={user.nombre}
          onChange={(e) => setUser({ ...user, nombre: e.target.value })}
          required
        />
        <FormField
          label="Apellido"
          type="text"
          value={user.apellido}
          onChange={(e) => setUser({ ...user, apellido: e.target.value })}
          required
        />
        <FormField
          label="Rol"
          type="select"
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          required
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "Social Manager" },
            { value: "survy_creator", label: "Creator De Encuestas" },
            { value: "moderator", label: "Analista" },
          ]}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <button
            type="button"
            onClick={() => setUser({ ...user, active: !user.active })}
            className={`mt-2 px-4 py-2 text-white rounded-md shadow-sm flex items-center justify-center ${
              user.active ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {user.active ? "Desactivar" : "Activar"}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#BD181E] text-white rounded-md shadow-sm flex items-center justify-center"
            disabled={isUploading}
          >
            <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
            {isUploading ? "Uploading..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CuentasForm;
