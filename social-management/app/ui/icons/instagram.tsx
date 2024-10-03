import Image from "next/image";

export default function InstagramLogo(){
    return(
        <div>
            <Image 
            src = '/images/instagram.png'
            alt = 'instagram logo'
            width={30}
            height={30}
            />
        </div>
    );
}