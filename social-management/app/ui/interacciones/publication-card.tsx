// publication-card.tsx
import React from 'react';

interface PublicationCardProps {
    socialNetwork: string;
    caption: string;
    commentsCount: number;
    onClick: () => void;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ socialNetwork, caption, commentsCount, onClick }) => (
    <div onClick={onClick} className="border border-gray-300 p-4 m-1 rounded-xl bg-white cursor-pointer hover:bg-gray-100">
        <h3 className="font-semibold">{socialNetwork}</h3>
        <p className="text-gray-700">{caption}</p>
        <p className="text-gray-500 text-sm">{commentsCount} comentarios</p>
    </div>
);

export default PublicationCard;
