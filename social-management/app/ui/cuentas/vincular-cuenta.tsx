import React from 'react';

import { LinkIcon, LinkSlashIcon } from "@heroicons/react/24/solid"
import GoogleLogo from "@/app/ui/icons/google"
import FacebookLogo from "@/app/ui/icons/facebook"
import InstagramLogo from "@/app/ui/icons/instagram"
import TiktokLogo from "@/app/ui/icons/tiktok"

interface Account {
    name: string;
    linked: boolean;
}

interface VincularCuentaProps {
    accounts: Account[];
}

const VincularCuenta: React.FC<VincularCuentaProps> = ({ accounts }) => {
    // Función para redirigir a la autenticación de cada red social
    const handleVincular = (accountName: string) => {
        switch (accountName) {
            case 'Facebook':
                window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=TU_CLIENT_ID&redirect_uri=TU_REDIRECT_URI&scope=email,public_profile`;
                break;
            case 'Google':
                window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=TU_CLIENT_ID&redirect_uri=TU_REDIRECT_URI&scope=email profile&response_type=code`;
                break;
            case 'Instagram':
                window.location.href = `https://api.instagram.com/oauth/authorize?client_id=TU_CLIENT_ID&redirect_uri=TU_REDIRECT_URI&scope=user_profile,user_media&response_type=code`;
                break;
            case 'Tiktok':
                window.location.href = `https://www.tiktok.com/auth/authorize?client_key=TU_CLIENT_KEY&redirect_uri=TU_REDIRECT_URI&scope=user.info.basic&response_type=code`;
                break;
            default:
                break;
        }
    };

    // Función para obtener el logo de cada red social
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

    return (
        <>
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
                            className={`flex px-4 py-1 rounded-md font-bold border-[#BD181E] border-2 ${account.linked ? 'bg-[#BD181E] text-white' : ' text-[#BD181E] bg-white-0'}`}
                            onClick={() => handleVincular(account.name)} // Aquí rediriges a la autenticación
                        >
                            {account.linked ? <LinkSlashIcon className="mr-5 h-5 w-5" /> : <LinkIcon className="mr-12 h-5 w-5" />}
                            {account.linked ? 'Desvincular' : 'Vincular'}
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
};

export default VincularCuenta;
