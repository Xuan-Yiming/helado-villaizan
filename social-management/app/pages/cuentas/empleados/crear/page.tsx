"use client";

import { useState } from "react";
import { MediaFILE, UserAccount } from "@/app/lib/types";
import Image from "next/image";
import { PutBlobResult } from "@vercel/blob";
import { useSearchParams } from "next/navigation";

import { TrashIcon } from "@heroicons/react/24/solid";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { createOrUpdateUserAccount } from "@/app/lib/database";

import { useEffect } from "react";
import { get_user_by_id } from "@/app/lib/database";

export default function CreateUserPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFILE>();
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const userId = searchParams.get("id") || "";

  const [user, setUser] = useState<UserAccount>({
    id: "",
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    role: "user",
    active: true,
    photo:
      "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg",
  });



  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const fetchedUser = await get_user_by_id(userId);
          if (fetchedUser) {
            setUser(fetchedUser);
          }
        } catch (error) {
          setErrorMessage("Error fetching user data");
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //upload image
      setUser({
        ...user,
        photo: "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg",
      });

      if (mediaFiles) {
        const response = await fetch(
          `/api/media/upload?filename=${mediaFiles.name}`,
          {
            method: "POST",
            body: mediaFiles.file,
          }
        );
        const newBlob = (await response.json()) as PutBlobResult;

        setBlob(newBlob);

        console.log("Response: ", newBlob.url);

        setUser({
          ...user,
          photo: newBlob.url,
        });

      }

      await createOrUpdateUserAccount(user)

      console.log("User created:", user);

    } catch (error) {}
    // Handle form submission logic here, e.g., send data to the server
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        id: "",
        file,
        url: URL.createObjectURL(file),
        type: "image",
        name: file.name,
      };

      setMediaFiles(newFile); // Only allow one file to be uploaded

      // Update user photo path
      setUser({ ...user, photo: newFile.url });

      // Reset the input value to allow re-uploading the same file
      event.target.value = ""; // This line ensures the file input is reset
    }
  };

  return (
    <main>
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden">
        <div className="w-full flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Detalle de Cuenta de Usuario</h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col lg:flex-row"
          >
            <div className="w-1/3">
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
              </div>
              {user.photo && (
                <div className="mb-4 flex flex-col items-center">
                  <div className="w-60 h-60 rounded-full overflow-hidden border border-gray-300 mb-4">
                    <Image
                      src={user.photo}
                      alt="User Photo"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                      loader={({ src }) => src}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setUser({ ...user, photo: "" })}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm flex items-center justify-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Quitar la foto
                  </button>
                </div>
              )}
            </div>
            <div className="w-2/3 pl-4">
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <button
                  type="button"
                  onClick={() => setUser({ ...user, active: !user.active })}
                  className={`mt-1 px-4 py-2 rounded-md shadow-sm flex items-center justify-center ${
                    user.active
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {user.active ? "Desactivar" : "Activar"}
                </button>
              </div>
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <input
                  type="email"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={user.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={user.apellido}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  title="Rol"
                  value={user.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="social_manager">Social Manager</option>
                  <option value="survy_creator">Creator De Encuestas</option>
                  <option value="moderator">Analista</option>
                </select>
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#BD181E] text-white rounded-md shadow-sm flex items-center justify-center"
                >
                  <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
