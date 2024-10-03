import Image from "next/image";

export default function FacebookLogo(){
    return(
        <div>
            <Image 
            src = '/images/facebook.png'
            alt = 'facebook logo'
            width={30}
            height={30}
            />
        </div>
    );
}