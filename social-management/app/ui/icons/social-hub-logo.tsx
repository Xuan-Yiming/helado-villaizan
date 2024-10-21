import Image from "next/image";

interface SocialHubLogoProps {
    width: number;
    height: number;
}

export default function SocialHubLogo({ width = 300, height = 300 }: SocialHubLogoProps) {
    return (
        <div>
            <Image
                src="/images/Logo-Social-Hub.png"
                alt="social hub logo"
                width={width}
                height={height}
                priority={true} 
            />
        </div>
    );
}
