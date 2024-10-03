import Image from "next/image";

export default function GoogleLogo(){
    return(
        <div>
            <Image 
            src = '/images/google.png'
            alt = 'google logo'
            width={30}
            height={30}
            />
        </div>
    );
}