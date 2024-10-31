// interaction-list.tsx
import React from 'react';

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
}

interface InteractionListProps {
    messages: InteractionMessage[];
    publications: InteractionPublication[];
    selectedMessageId: number | null;
    selectedPublicationId: number | null;
    onSelectMessage: (id: number) => void;
    onSelectPublication: (id: number) => void;
}

const InteractionList: React.FC<InteractionListProps> = ({ messages, publications, selectedMessageId, selectedPublicationId, onSelectMessage, onSelectPublication }) => (
    <ul>
        {messages.map((message) => (
            <li
                key={message.id}
                onClick={() => onSelectMessage(message.id)}
                className={`p-2 mb-2 rounded-lg cursor-pointer ${selectedMessageId === message.id ? 'bg-blue-100 border border-blue-500' : 'bg-white'} hover:bg-gray-100`}
            >
                <strong>{message.userName}</strong> ({message.socialNetwork})
                <p>{message.lastMessage}</p>
            </li>
        ))}
        {publications.map((publication) => (
            <li
                key={publication.id}
                onClick={() => onSelectPublication(publication.id)}
                className={`p-2 mb-2 rounded-lg cursor-pointer ${selectedPublicationId === publication.id ? 'bg-blue-100 border border-blue-500' : 'bg-white'} hover:bg-gray-100`}
            >
                <strong>{publication.socialNetwork}</strong>
                <p>{publication.caption}</p>
                <p className="text-sm text-gray-600">{publication.commentsCount} comentarios</p>
            </li>
        ))}
    </ul>
);

export default InteractionList;
