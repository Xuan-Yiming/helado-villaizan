// interaction-list.tsx
import React from 'react';
import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";

interface InteractionMessage {
    id: number;
    userName: string;
    socialNetwork: string;
    lastMessage: string;
}

interface InteractionPublication {
    id: number;
    socialNetwork: string;
    caption: string;
    commentsCount: number;
    publishDate: string; // Nueva propiedad para la fecha de publicación
    type?: string; // Nueva propiedad para el tipo de contenido
}

interface InteractionListProps {
    messages: InteractionMessage[];
    publications: InteractionPublication[];
    selectedMessageId: number | null;
    selectedPublicationId: number | null;
    onSelectMessage: (id: number) => void;
    onSelectPublication: (id: number) => void;
}

// Función para obtener el ícono de la red social
const getSocialIcon = (socialNetwork: string) => {
    switch (socialNetwork.toLowerCase()) {
        case 'facebook':
            return <span className="w-5 h-5 mr-2"><FacebookLogo /></span>;
        case 'instagram':
            return <span className="w-5 h-5 mr-2"><InstagramLogo /></span>;
        default:
            return null;
    }
};

const InteractionList: React.FC<InteractionListProps> = ({ messages, publications, selectedMessageId, selectedPublicationId, onSelectMessage, onSelectPublication }) => (
    <ul>
        {messages.map((message) => (
            <li
                key={message.id}
                onClick={() => onSelectMessage(message.id)}
                className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer ${selectedMessageId === message.id ? 'bg-blue-100 border border-blue-500' : 'bg-white'} hover:bg-gray-100`}
            >
                {getSocialIcon(message.socialNetwork)}
                <div>
                    <strong>{message.userName}</strong> 
                    <p>{message.lastMessage}</p>
                </div>
            </li>
        ))}
        {publications.map((publication) => (
            <li
                key={publication.id}
                onClick={() => onSelectPublication(publication.id)}
                className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer ${selectedPublicationId === publication.id ? 'bg-blue-100 border border-blue-500' : 'bg-white'} hover:bg-gray-100`}
            >
                {getSocialIcon(publication.socialNetwork)}
                <div>
                    <p className="font-semibold">{publication.caption}</p>
                    <p className="text-sm text-gray-500">Publicado el {publication.publishDate}</p>
                    <p className="text-sm text-gray-600">{publication.commentsCount} comentarios</p>
                    {publication.type && <p className="text-sm text-gray-600">Tipo: {publication.type}</p>}
                </div>
            </li>
        ))}
    </ul>
);

export default InteractionList;
