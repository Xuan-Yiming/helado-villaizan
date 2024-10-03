import Image from "next/image";

export default function Logo(){
    return(
        <div>
            <Image 
            src = '/images/Logo.png'
            alt = 'helado villaizan logo'
            width={100}
            height={50}
            />
        </div>
    );
}