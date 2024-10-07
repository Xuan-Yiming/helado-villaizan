'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid"

import { LinkIcon, LinkSlashIcon } from "@heroicons/react/24/solid"
import GoogleLogo from "@/app/ui/icons/google"
import FacebookLogo from "@/app/ui/icons/facebook"
import InstagramLogo from "@/app/ui/icons/instagram"
import TiktokLogo from "@/app/ui/icons/tiktok"

var accounts = [
    {
        name: 'Facebook',
        linked: false,
    },
    {
        name: 'Instagram',
        linked: false,
    },
    {
        name: 'Tiktok',
        linked: false,
    },
    {
        name: 'Google',
        linked: false,
    },
]

export default function Page(){
    const router = useRouter();

    const handleLogout = async () => {
        await axios.get('/api/auth/logout');
        router.push('/login');
    };

    const getLogo = (name: string) => {
        switch (name) {
            case 'Facebook':
                return <FacebookLogo />;
            case 'Instagram':
                return <InstagramLogo />;
            case 'Tiktok':
                return <TiktokLogo />;
            case 'Google':
                return <GoogleLogo />;
            default:
                return null;
        }
    };

    const handleLink = (name: string, linked: boolean) => {
        if (linked) {
            switch (name) {
                case 'Tiktok':
                    return '/api/tiktok/logout';
                case 'Facebook':
                    return '/api/facebook/logout';
                case 'Instagram':
                    return '/api/instagram/logout';
                case 'Google':
                    return '/api/google/logout';
            }
        }else{
            switch (name) {
                case 'Tiktok':
                    return '/api/tiktok/login';
                case 'Facebook':
                    return '/api/facebook/login';
                case 'Instagram':
                    return '/api/instagram/login';
                case 'Google':
                    return '/api/google/login';
            }
        }
        return '';
    };

    return (
        <main>
            <h1 className="font-bold text-4xl">Cuentas y Configuraciones</h1>

            <div className="mt-10">
                <h2 className="font-bold text-2xl">Cuentas</h2>
                <p>En esta sección podrás ver las cuentas que tienes vinculadas a tu perfil.</p>
                <div>
                {accounts.map((account, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-200 py-2">
                    <div className="flex items-center">
                        {getLogo(account.name)}
                        <div className="ml-2">
                            <p className="font-bold">{account.name}</p>
                        </div>
                    </div>
                    <div className="">
                        <button 
                            onClick={async () => {
                                const link = handleLink(account.name, account.linked);
                                if (link) {
                                    window.location.href = link;
                                    router.push('/pages/cuentas-configuraciones');
                                }
                            }}
                            className={`flex px-4 py-2 rounded-md font-bold border-[#BD181E] border-2 ${account.linked ? 'bg-[#BD181E] text-white' : ' text-[#BD181E] bg-white-0'}`}
                        >
                            {account.linked ? <LinkSlashIcon className="mr-5 h-5 w-5" /> : <LinkIcon className="mr-12 h-5 w-5" />}
                            {account.linked ? 'Desvincular' : 'Vincular'}
                        </button>
                    </div>
                </div>
            ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="font-bold text-2xl">Configuraciones</h2>
                <p>En esta sección podrás configurar tu perfil y tus preferencias.</p>
                <div className="flex justify-end"> {/* Added div with flex justify-end */}
                    <button 
                        className="flex bg-[#BD181E] text-white px-4 py-2 rounded-md mt-4 font-bold"
                        onClick={handleLogout}
                    >
                        <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-2" />
                        Cerrar sesión
                    </button>
                </div> {/* Added closing div */}
            </div>

        </main>
    )
}