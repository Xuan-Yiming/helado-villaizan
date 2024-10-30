'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { ArrowRightEndOnRectangleIcon, LinkIcon, LinkSlashIcon } from '@heroicons/react/24/solid';
import GoogleLogo from '@/app/ui/icons/google';
import FacebookLogo from '@/app/ui/icons/facebook';
import InstagramLogo from '@/app/ui/icons/instagram';
import TiktokLogo from '@/app/ui/icons/tiktok';

import { load_all_social_accounts } from '@/app/lib/database';
import { SocialAccount } from '@/app/lib/types';
import { initMetaSdk, metaLogin, handleMetaAccount } from './meta-login'; // Importamos las funciones

interface Account {
    name: string;
    socialAccount?: SocialAccount;
    linked: boolean;
}

const initialAccounts: Account[] = [
    { name: 'Facebook', socialAccount: undefined, linked: false },
    { name: 'Instagram', socialAccount: undefined, linked: false },
    { name: 'TikTok', socialAccount: undefined, linked: false },
    { name: 'Google', socialAccount: undefined, linked: false },
];

export default function Page() {
    const router = useRouter();
    const [accountsState, setAccountsState] = useState<Account[]>(initialAccounts);

    useEffect(() => {
        initMetaSdk(); // Inicializa el SDK de Meta

        const fetchData = async () => {
            const socialAccounts = await load_all_social_accounts();
            const updatedAccounts = initialAccounts.map((account) => {
                const socialAccount = socialAccounts.find(
                    (sa) => sa.red_social.toLowerCase() === account.name.toLowerCase()
                );
                return { ...account, socialAccount, linked: !!socialAccount };
            });
            setAccountsState(updatedAccounts);
            document.cookie = `socialAccounts=${JSON.stringify(socialAccounts)}; path=/;`;
        };

        fetchData();
    }, []);

const handleLink = async (name: string, linked: boolean) => {
    if (linked) {
        switch (name) {
            case 'Facebook':
                router.push('/api/meta/logout');
                break;
            case 'Instagram':
                router.push('/api/meta/logout');
                break;
            case 'TikTok':
                router.push('/api/tiktok/logout');
                break;
            case 'Google':
                router.push('/api/google/logout');
                break;
            default:
                console.error('Plataforma desconocida para logout');
        }
    } else {
        switch (name) {
            case 'Facebook':
            case 'Instagram':
                try {
                    const authResponse = await metaLogin(); // Realiza el login
                    await handleMetaAccount(authResponse); // Guarda la cuenta en la BD
                    console.log(`${name} vinculado exitosamente.`);
                } catch (error) {
                    console.error('Error durante la vinculación con Meta:', error);
                }
                break;
            case 'TikTok':
                console.log('Entra a TikTok');
                router.push('/api/tiktok/login');
                break;
            case 'Google':
                router.push('/api/google/login');
                break;
            default:
                console.error('Plataforma desconocida para login');
        }
    }
};


    const getLogo = (name: string) => {
        switch (name) {
            case 'Facebook':
                return <FacebookLogo />;
            case 'Instagram':
                return <InstagramLogo />;
            case 'TikTok':
                return <TiktokLogo />;
            case 'Google':
                return <GoogleLogo />;
            default:
                return null;
        }
    };

    return (
        <main>
            <div className="">
                <h2 className="font-bold text-2xl">Cuentas de Redes Sociales</h2>
                <p>En esta sección podrás ver las cuentas que tienes vinculadas.</p>
                <div>
                    {accountsState.map((account, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-200 py-2">
                            <div className="flex items-center">
                                {getLogo(account.name)}
                                <div className="ml-2">
                                    <p className="font-bold">{account.name}</p>
                                </div>
                                <div className="ml-2">
                                    <p>: {account.socialAccount?.usuario}</p>
                                </div>
                            </div>
                            <div className="">
                                <button 
                                    onClick={() => handleLink(account.name, account.linked)}
                                    className={`flex px-4 py-2 rounded-md font-bold border-[#BD181E] border-2 ${account.linked ? 'text-[#BD181E] bg-white-0' : '  bg-[#BD181E] text-white'}`}
                                >
                                    {account.linked ? <LinkSlashIcon className="mr-5 h-5 w-5" /> : <LinkIcon className="mr-12 h-5 w-5" />}
                                    {account.linked ? 'Desvincular' : 'Vincular'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



        </main>
    );
}
