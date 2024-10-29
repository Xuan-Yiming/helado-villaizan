"use client";

import { useState } from "react";
import { UserAccount } from "@/app/lib/types";
import Image from "next/image";

export default function CreateUserPage() {
  const [user, setUser] = useState<UserAccount>({
    id: "",
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    role: "user",
    active: true,
    photo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to the server
    console.log("User created:", user);
  };

  return (
    <main>
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden">
        <div className="w-full flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Detalle de Cuenta de Usuario</h1>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col lg:flex-row">
            <div className="w-1/3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Foto de perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setUser({
                          ...user,
                          photo: event.target?.result as string,
                        });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              {user.photo && (
                <div className="mb-4 flex flex-col items-center">
                  <Image
                    src={user.photo}
                    alt="User Photo"
                    width={50}
                    height={50}
                    className="mt-1 block w-full max-w-xs border border-gray-300 rounded-md shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setUser({ ...user, photo: "" })}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm"
                  >
                    Quitar la foto
                  </button>
                </div>
              )}
            </div>
            <div className="w-2/3 pl-4">
              <div className="mb-4 max-w-md">
                <label className="block text-sm font-medium text-gray-700">
                  Activo
                </label>
                <input
                  type="checkbox"
                  name="active"
                  checked={user.active}
                  onChange={(e) =>
                    setUser({ ...user, active: e.target.checked })
                  }
                  className="mt-1 block"
                />
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
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#BD181E] text-white rounded-md shadow-sm"
                >
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
