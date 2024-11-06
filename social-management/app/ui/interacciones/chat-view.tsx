//chat-view.tsx
import React, { useState, useEffect, useRef } from 'react';
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

const ChatView: React.FC<ChatViewProps> = ({ chatContent, onSendMessage, chatType, selectedCommentId, selectedCommentUserName, selectedUserName, publicationInfo, onSelectComment }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Función para desplazar el scroll del contenedor de mensajes al final
    const scrollToBottom = () => {
        messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        // Llamamos a scrollToBottom cada vez que chatContent cambia
        scrollToBottom();
    }, [chatContent]);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="border border-gray-300 rounded-xl bg-white flex flex-col h-full max-h-[650px]">
            <div className="p-4 border-b text-gray-700 font-semibold">
                {chatType === 'message' && selectedUserName && `Conversación con ${selectedUserName}`}
                {chatType === 'comments' && publicationInfo && publicationInfo}
            </div>

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4">
                {chatContent.length > 0 ? (
                    chatContent.map(chat => (
                        <div
                            key={chat.id}
                            className={`p-2 rounded-lg ${
                                chatType === 'comments' ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default'
                            } ${
                                chatType === 'comments' && chat.id === selectedCommentId ? 'border border-blue-500' : ''
                            } ${chat.fromUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
                            onClick={() => chatType === 'comments' && onSelectComment(chat.id, chat.userName || '')}
                        >
                            {chatType === 'comments' && chat.userName && <p className="font-semibold">{chat.userName}</p>}
                            {chatType === 'comments' && chat.formattedDate && (
                                <p className="text-xs text-gray-500">{chat.formattedDate}</p>
                            )}
                            <p>{chat.text}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center mt-10">
                        <p>Esta publicación no tiene mensajes.</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t">
                {selectedCommentUserName && (
                    <div className="mb-2 text-sm text-gray-600">
                        Respondiendo comentario de <span className="font-semibold">{selectedCommentUserName}</span>
                    </div>
                )}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe tu mensaje aquí..."
                        className="flex-1 border p-2 rounded mr-2"
                    />
                    <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Enviar</button>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
