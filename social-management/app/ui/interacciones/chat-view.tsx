import React, { useState, useRef } from 'react';
import { ChatMessage } from '@/app/lib/types';

interface ChatViewProps {
    chatContent: ChatMessage[];
    onSendMessage: (message: string) => void;
    chatType: string;
    selectedCommentId: string | null;
    selectedCommentUserName: string | null;
    selectedUserName: string | null;
    publicationInfo: string | null;
    onSelectComment: (commentId: string, userName: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({
    chatContent,
    onSendMessage,
    chatType,
    selectedCommentId,
    selectedCommentUserName,
    selectedUserName,
    publicationInfo,
    onSelectComment
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    // Función para formatear la fecha y hora
    const formatDate = (timestamp: Date | string) => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    
    return (
        <div className="border border-gray-300 rounded-xl bg-white flex flex-col h-full max-h-[650px]">
            <div className="p-4 border-b text-gray-700 font-semibold">
                {publicationInfo}
            </div>

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4">
                {chatContent.length > 0 ? (
                    chatContent.map((chat) => (
                        <div
                            key={chat.id}
                            className={`${
                                chatType === 'message'
                                    ? `w-[70%] p-3 rounded-lg shadow-sm flex flex-col ${
                                          chat.fromUser
                                              ? 'bg-blue-200 text-black self-end text-right ml-auto'
                                              : 'bg-gray-200 text-black self-start text-left mr-auto'
                                      }`
                                    : `p-2 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 ${
                                          chat.id === selectedCommentId ? 'border border-blue-500' : ''
                                      }`
                            }`}
                            onClick={() =>
                                chatType === 'comments' && onSelectComment(chat.id, chat.userName || '')
                            }
                        >
                            {chatType === 'comments' && chat.userName && (
                                <p className="font-semibold">{chat.userName}</p>
                            )}
                            {chat.attachment?.type === 'image' ? (
                                <img src={chat.attachment.url} alt="Imagen" className="max-w-xs mt-2 rounded-lg" />
                            ) : chat.attachment?.type === 'sticker' ? (
                                <img src={chat.attachment.url} alt="Sticker" className="w-24 h-24 mt-2 rounded-lg" />
                            ) : (
                                <p>{chat.text || <span className="italic text-gray-500">[Mensaje desconocido]</span>}</p>
                            )}

                            {chat.timestamp && (
                                <p className="text-xs mt-1 text-gray-500 text-right">
                                    {formatDate(chat.timestamp)}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center mt-10">
                        <p>
                            {chatType === 'comments'
                                ? 'Esta publicación no tiene comentarios.'
                                : 'No hay mensajes en esta conversación.'}
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t">
                {chatType === 'comments' && selectedCommentUserName && (
                    <div className="mb-2 text-sm text-gray-600">
                        Respondiendo comentario de <span className="font-semibold">{selectedCommentUserName}</span>
                    </div>
                )}
                {(chatType === 'comments' || chatType === 'message') && (
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            className="flex-1 border p-2 rounded mr-2"
                        />
                        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Enviar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatView;
