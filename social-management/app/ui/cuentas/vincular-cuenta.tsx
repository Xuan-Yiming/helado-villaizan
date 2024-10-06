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
                            className={`flex px-4 py-2 rounded-md font-bold border-[#BD181E] border-2 ${account.linked ? 'bg-[#BD181E] text-white' : ' text-[#BD181E] bg-white-0'}`}
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