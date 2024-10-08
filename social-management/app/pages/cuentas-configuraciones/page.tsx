'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { LinkIcon, LinkSlashIcon } from "@heroicons/react/24/solid";
import GoogleLogo from "@/app/ui/icons/google";
import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import TiktokLogo from "@/app/ui/icons/tiktok";

// Extender la interfaz Window para incluir las propiedades FB y fbAsyncInit
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

interface Account {
    name: string;
    linked: boolean;
}

const initialAccounts: Account[] = [
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
];

export default function Page() {
    const router = useRouter();
    const [facebookAccessToken, setFacebookAccessToken] = useState<string | null>(null);
    const [accountsState, setAccountsState] = useState<Account[]>(initialAccounts);

    useEffect(() => {
        // Inicializar el estado de las cuentas desde Local Storage
        const storedAccounts = localStorage.getItem('accountsState');
        if (storedAccounts) {
            try {
                const parsedAccounts: Account[] = JSON.parse(storedAccounts);
                setAccountsState(parsedAccounts);
            } catch (error) {
                console.error('Error parsing stored accounts:', error);
            }
        }

        // Inicializar el SDK de Facebook
        if (typeof window !== 'undefined' && !window.FB) {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: '1175119930457893',  // Reemplaza con tu App ID de Facebook
                    cookie: true,
                    xfbml: true,
                    version: 'v20.0',
                });
                window.FB.XFBML.parse(); 
            };

            (function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                const js = d.createElement(s) as HTMLScriptElement;
                js.id = id;
                js.src = "https://connect.facebook.net/es_ES/sdk.js";
                if (fjs && fjs.parentNode) {
                    fjs.parentNode.insertBefore(js, fjs);
                }
            })(document, 'script', 'facebook-jssdk');
        }
    }, []);

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

    const handleLink = async (name: string, linked: boolean) => {
        if (linked) {
            // Lógica para desvincular la cuenta
            switch (name) {
                case 'Facebook':
                    return '/api/facebook/logout';
                default:
                    return '';
            }
        } else {
            // Lógica para vincular la cuenta
            switch (name) {
                case 'Facebook':
                    // Inicia el proceso de vinculación con Facebook
                    window.FB.login(function (response: any) {
                        if (response.authResponse) {
                            const userAccessToken = response.authResponse.accessToken;
                            console.log('Facebook login successful:', response);
                            console.log('User Access Token:', userAccessToken);

                            // Obtener las páginas administradas por el usuario
                            window.FB.api('/me/accounts', function (response: any) {
                                const pages = response.data;
                                if (pages.length > 0) {
                                    const pageAccessToken = pages[0].access_token;
                                    setFacebookAccessToken(pageAccessToken);
                                    console.log('Facebook Page Access Token:', pageAccessToken);

                                    // Actualizar el estado para mostrar que Facebook está vinculado
                                    const updatedAccounts = accountsState.map((account) =>
                                        account.name === 'Facebook' ? { ...account, linked: true } : account
                                    );
                                    setAccountsState(updatedAccounts);

                                    // Guardar el estado actualizado en Local Storage
                                    localStorage.setItem('accountsState', JSON.stringify(updatedAccounts));
                                } else {
                                    console.log('No se encontraron páginas administradas por el usuario.');
                                }
                            });
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                        }
                    }, { scope: 'pages_manage_posts,pages_read_engagement,pages_show_list' });
                    break;
                default:
                    return '';
            }
        }
    };

    return (
        <main>
            <h1 className="font-bold text-4xl">Cuentas y Configuraciones</h1>

            <div className="mt-10">
                <h2 className="font-bold text-2xl">Cuentas</h2>
                <p>En esta sección podrás ver las cuentas que tienes vinculadas a tu perfil.</p>
                <div>
                    {accountsState.map((account, index) => (
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
                                        const link = await handleLink(account.name, account.linked);
                                        if (link) {
                                            window.location.href = link;
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
