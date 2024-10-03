import Image from "next/image";

export default function TiktokLogo(){
    return(
        <div>
            <Image 
            src = '/images/tiktok.png'
            alt = 'tiktok logo'
            width={30}
            height={30}
            />
        </div>
    );
}