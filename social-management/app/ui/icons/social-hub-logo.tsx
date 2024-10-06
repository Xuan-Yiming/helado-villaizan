import Image from "next/image";

interface SocialHubLogoProps {
    width: number;
    height: number;
}

export default function SocialHubLogo({ width, height }: SocialHubLogoProps) {
    return (
        <div>
            <Image
                src="/images/Logo-Social-Hub.png"
                alt="social hub logo"
                width={width}
                height={height}
            />
        </div>
    );
}
