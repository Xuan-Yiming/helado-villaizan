import Image from "next/image";

export default function SocialHubLogo(){
    return(
        <div>
            <Image 
            src = '/images/Logo-Social-Hub.png'
            alt = 'social hub logo'
            width={500}
            height={100}
            />
        </div>
    );
}

