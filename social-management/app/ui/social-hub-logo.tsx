import Image from "next/image";

export default function SocialHubLogo(){
    return(
        <div>
            <Image 
            src = '/images/Logo-Social-Hub.png'
            alt = 'social hub logo'
            width={360}
            height={50}
            />
        </div>
    );
}

