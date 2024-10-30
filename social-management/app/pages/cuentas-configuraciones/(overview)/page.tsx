'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { ArrowRightEndOnRectangleIcon, LinkIcon, LinkSlashIcon } from '@heroicons/react/24/solid';


export default function Page() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("")

    const handleLogout = async () => {
        await axios.get('/api/auth/logout');
        router.push('/login');
    };

    const handleChangePassword = async () => {

    };

    return (
        <main>
            <div className="">
                <h2 className="font-bold text-2xl">Configuraciones</h2>
                <p>En esta sección podrás configurar tu perfil y tus preferencias.</p>

                <div className="mt-8">
                    <h3 className="font-bold text-xl mb-4">Información del Usuario</h3>
                    <p className="text-sm text-gray-600 mb-2">Nombre: Juan Pérez</p>
                    <p className="text-sm text-gray-600 mb-2">Apellido: González</p>
                    <p className="text-sm text-gray-600 mb-2">Rol: Administrador</p>
                </div>

                <div className="mt-8">
                    <h3 className="font-bold text-xl mb-4">Cambiar Contraseña</h3>
                    <p className="text-sm text-gray-600 mb-2">La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.</p>
                    <div className="flex space-x-4">
                        <input 
                            type="password" 
                            placeholder="Nueva contraseña" 
                            className="border rounded-md p-2 flex-1"
                        />
                        <input 
                            type="password" 
                            placeholder="Confirmar nueva contraseña" 
                            className="border rounded-md p-2 flex-1"
                        />
                        <button 
                        onClick={handleChangePassword}
                            className="bg-[#BD181E] text-white px-4 py-2 rounded-md font-bold"
                        >
                            Confirmar
                        </button>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>

                <div className="flex justify-end fixed bottom-4 right-4">
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
