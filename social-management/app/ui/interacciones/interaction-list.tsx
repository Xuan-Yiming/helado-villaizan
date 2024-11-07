// interaction-list.tsx
import React from 'react';
import FacebookLogo from "@/app/ui/icons/facebook";
import InstagramLogo from "@/app/ui/icons/instagram";
import { InteractionPublication, InteractionMessage } from "@/app/lib/types";

type Interaction = InteractionPublication | InteractionMessage;

interface InteractionListProps {
    items: Interaction[];
    selectedInteractionId: string | null;
    onSelectInteraction: (id: string) => void;
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

const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha no válida';
    
    const today = new Date();
    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }
};

const InteractionList: React.FC<InteractionListProps> = ({ items, selectedInteractionId, onSelectInteraction }) => (
    <ul>
        {items.map((interaction) => {
            const interactionId = interaction.type === 'message' ? String(interaction.id) : interaction.postId;
            const isSelected = selectedInteractionId === interactionId;

            return (
                <li
                    key={interactionId}
                    onClick={() => onSelectInteraction(interactionId)}
                    className={`flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer ${
                        isSelected ? 'bg-blue-100 border border-blue-500 shadow-lg' : 'bg-white'
                    } hover:bg-gray-100`}
                >
                    <div className="flex items-center w-full">
                        {getSocialIcon(interaction.socialNetwork)}
                        <div className="flex-grow">
                            {interaction.type === 'message' ? (
                                <>
                                    <p className="font-semibold">{interaction.userName}</p>
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-600 flex-grow">{interaction.lastMessage}</p>
                                        <p className="text-sm text-gray-500 ml-2">{interaction.messageCount || 0} mensajes</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(interaction.updatedTime)}</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold">{interaction.caption}</p>
                                    <p className="text-sm text-gray-500">
                                        Publicado el {interaction.publishDate ? formatDate(interaction.publishDate) : 'Fecha no disponible'}
                                    </p>
                                    <p className="text-sm text-gray-600">{interaction.commentsCount || 0} comentarios</p>
                                </>
                            )}
                        </div>
                        {interaction.type === 'publication' && interaction.thumbnail && (
                            <div className="ml-auto flex items-center">
                                <img src={interaction.thumbnail} alt="Miniatura" className="w-14 h-14 object-cover rounded" />
                            </div>
                        )}
                    </div>
                </li>
            );
        })}
    </ul>
);

export default InteractionList;
