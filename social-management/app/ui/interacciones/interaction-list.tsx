import React from 'react';
import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import { InteractionPublication } from "@/app/lib/types";

interface InteractionListProps {
    items: InteractionPublication[];
    selectedPublicationId: string | null;
    onSelectPublication: (id: string) => void;
}

const getSocialIcon = (socialNetwork?: string) => {
    if (!socialNetwork) return null;
    switch (socialNetwork.toLowerCase()) {
        case 'facebook':
            return <span className="w-5 h-5 mr-2"><FacebookLogo /></span>;
        case 'instagram':
            return <span className="w-5 h-5 mr-2"><InstagramLogo /></span>;
        default:
            return null;
    }
};

const InteractionList: React.FC<InteractionListProps> = ({ items, selectedPublicationId, onSelectPublication }) => (
    <ul>
        {items.map((publication) => (
            <li
                key={publication.postId}
                onClick={() => onSelectPublication(publication.postId)}
                className={`flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer ${
                    selectedPublicationId === publication.postId ? 'bg-blue-100 border border-blue-500' : 'bg-white'
                } hover:bg-gray-100`}
            >
                <div className="flex items-start">
                    {getSocialIcon(publication.socialNetwork)}
                    <div>
                        <p className="font-semibold">{publication.caption}</p>
                        <p className="text-sm text-gray-500">
                            Publicado el {publication.publishDate ? new Date(publication.publishDate).toLocaleDateString() : 'Fecha no disponible'}
                        </p>
                        <p className="text-sm text-gray-600">{publication.commentsCount || 0} comentarios</p>
                    </div>
                </div>
                {publication.thumbnail && (
                    <img src={publication.thumbnail} alt="Miniatura" className="w-12 h-12 object-cover rounded ml-4" />
                )}
            </li>
        ))}
    </ul>
);

export default InteractionList;
