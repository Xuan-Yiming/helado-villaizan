"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  ArrowRightEndOnRectangleIcon,
  LinkIcon,
  LinkSlashIcon,
} from "@heroicons/react/24/solid";
import { MediaFILE, UserAccount } from "@/app/lib/types";
import { check_password_requirement } from "@/app/lib/actions";
import { update_password } from "@/app/lib/database";

import ProfilePhotoUpload from "@/app/ui/cuentas/profile-foto";
import { useError } from "@/app/context/errorContext";

const DEFAULT_PROFILE_PHOTO = "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg";

export default function Page() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<UserAccount>();
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<MediaFILE | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showError } = useError();

  useEffect(() => {
    const cookie = document.cookie;
    const userInformation = cookie
      .split(";")
      .find((c) => c.trim().startsWith("user="));

    if (userInformation) {
      const userValue = userInformation.split("=")[1];
      setUser(JSON.parse(decodeURIComponent(userValue)));
    }
  }, []);

  useEffect(()=>{
    setMediaFiles({
        id: Math.random().toString(36).substr(2, 9),
        file: new File([], "default.jpg"),
        url: user?.photo||DEFAULT_PROFILE_PHOTO,
        type: "image",
        name: "",
      });
  },[user]);

  const handleLogout = async () => {
    await axios.get("/api/auth/logout");
    router.push("/login");
  };

  const handleChangePassword = async () => {
    try {
      if (user) {
        setIsUploading(true);
        await check_password_requirement(password, newPassword);
        await update_password(user.id, newPassword);
        setPassword("")
        setNewPassword("")
        setErrorMessage("contraseña actualizada")
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Error al cambiar la contraseña");
    } finally {
        setIsUploading(false);
      }
  };

  return (
    <main>
      <div className="">
        <h2 className="font-bold text-2xl">Configuraciones</h2>
        <p>En esta sección podrás configurar tu perfil y tus preferencias.</p>

        <div className="mt-8">
          <ProfilePhotoUpload
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
            ifSave ={true}
            userID={user?.id}
          />
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4">Información del Usuario</h3>
          <p className="text-sm text-gray-600 mb-2">Nombre: {user?.nombre}</p>
          <p className="text-sm text-gray-600 mb-2">
            Apellido: {user?.apellido}
          </p>
          <p className="text-sm text-gray-600 mb-2">Rol: {user?.role}</p>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4">Cambiar Contraseña</h3>
          <p className="text-sm text-gray-600 mb-2">
            La contraseña debe tener al menos 8 caracteres, incluyendo una letra
            mayúscula, una letra minúscula y un número.
          </p>
          <div className="flex space-x-4">
            <input
            value={password}
              type="password"
              placeholder="Nueva contraseña"
              className="border rounded-md p-2 flex-1"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
            value={newPassword}
              type="password"
              placeholder="Confirmar nueva contraseña"
              className="border rounded-md p-2 flex-1"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className="bg-[#BD181E] text-white px-4 py-2 rounded-md font-bold"
            >
               {isUploading ? "Actualizando..." : "Confirmar"}
            </button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>

        <div className="flex justify-end">
          <button
            className="flex bg-[#BD181E] text-white px-4 py-2 rounded-md mt-4 font-bold"
            onClick={handleLogout}
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-2" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
