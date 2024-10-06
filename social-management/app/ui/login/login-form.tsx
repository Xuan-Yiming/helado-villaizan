'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { inter } from '../fonts';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          const response = await axios.post('/api/auth/login', { email, password });
          if (response.data.success) {
              router.push('/pages');
          } else {
              setError(response.data.error || 'Login failed');
          }
      } catch (err) {
            setError('Algo salió mal. Por favor, inténtalo de nuevo.');
      }
  };


  return (
    <form className="space-y-3" onSubmit={handleSubmit} >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${inter.className} mb-3 text-2xl`}>
          Por favor inicia sesión
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Ingresar Email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Ingresar Contraseña"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <button  
        type="submit"
        className="mt-10 w-full font-bold bg-[#BD181E] text-white px-4 py-2 rounded-md border-none text-center flex items-center justify-center"
        >
          Iniciar Sesión <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
        <div className="flex h-8 items-end space-x-1">
          
          {error && <> <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> <p className="text-sm text-red-500">{error}</p> </> }
        </div>
      </div>
    </form>
  );
}
