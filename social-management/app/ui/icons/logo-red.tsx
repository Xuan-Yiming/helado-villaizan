import Image from "next/image";

export default function Logo(){
    return(
        <div>
            <Image 
            src = '/images/Logo-red.png'
            alt = 'helado villaizan red logo'
            width={100}
            height={50}
            />
        </div>
    );
}