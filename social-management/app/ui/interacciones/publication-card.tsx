// publication-card.tsx
import React from 'react';
import Image from "next/image";
import { InteractionPublication } from "@/app/lib/types";

interface PublicationCardProps extends InteractionPublication {
    onClick: () => void;
    isSelected: boolean; // Nueva prop para determinar si está seleccionado
}

const PublicationCard: React.FC<PublicationCardProps> = ({ socialNetwork, caption, commentsCount, thumbnail, onClick, isSelected }) => (
    <div 
        onClick={onClick} 
        className={`border p-4 m-1 rounded-xl bg-white cursor-pointer hover:bg-gray-100 flex items-center ${
            isSelected ? 'bg-blue-100 border-blue-500 shadow-lg' : 'border-gray-300'
        }`}
    >
        {thumbnail && (
            <div className="relative w-12 h-12 mr-4">
                {thumbnail.endsWith(".mp4") ? (
                    <video src={thumbnail} className="w-full h-full object-cover rounded-md" muted autoPlay loop />
                ) : (
                    <Image src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-md" width={50} height={50} />
                )}
            </div>
        )}
        <div>
            <h3 className="font-semibold">{socialNetwork}</h3>
            <p className="text-gray-700">{caption}</p>
            <p className="text-gray-500 text-sm">{commentsCount} comentarios</p>
        </div>
    </div>
);

export default PublicationCard;
