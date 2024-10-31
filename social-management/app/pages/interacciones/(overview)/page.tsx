// Page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    AdjustmentsHorizontalIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/solid';

import FilterSelect from '@/app/ui/interacciones/filter-select';
import InteractionList from '@/app/ui/interacciones/interaction-list';
import ChatView from '@/app/ui/interacciones/chat-view';

interface ChatMessage {
    id: number;
    text: string;
    fromUser: boolean;
    userName?: string;
}

const interactionMessagesData = [
    { id: 1, userName: 'Jane Doe', socialNetwork: 'facebook', lastMessage: '¿Puedes enviarme más información?' },
    { id: 2, userName: 'Carlos Perez', socialNetwork: 'instagram', lastMessage: 'Gracias por la respuesta!' }
];

const interactionPublicationsData = [
    { id: 1, socialNetwork: 'facebook', caption: 'Nueva promoción en productos!', commentsCount: 2, publishDate: '2023-10-30', type: 'imagen' },
    { id: 2, socialNetwork: 'instagram', caption: 'Descubre nuestras ofertas de verano', commentsCount: 3, publishDate: '2023-10-31', type: 'video' }
];

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [interactionTypeFilter, setInteractionTypeFilter] = useState('all');
    const [filteredMessages, setFilteredMessages] = useState(interactionMessagesData);
    const [filteredPublications, setFilteredPublications] = useState(interactionPublicationsData);
    const [selectedChat, setSelectedChat] = useState<ChatMessage[]>([]);
    const [chatType, setChatType] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [selectedCommentUserName, setSelectedCommentUserName] = useState<string | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
    const [publicationInfo, setPublicationInfo] = useState<string | null>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const [selectedPublicationId, setSelectedPublicationId] = useState<number | null>(null);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setSocialNetworkFilter('all');
        setInteractionTypeFilter('all');
        setFilteredMessages(interactionMessagesData);
        setFilteredPublications(interactionPublicationsData);
    };

    const applyFilters = () => {
        setFilteredMessages(interactionMessagesData.filter(msg => 
            (socialNetworkFilter === 'all' || msg.socialNetwork === socialNetworkFilter) &&
            (interactionTypeFilter === 'all' || interactionTypeFilter === 'direct')
        ));

        setFilteredPublications(interactionPublicationsData.filter(pub => 
            (socialNetworkFilter === 'all' || pub.socialNetwork === socialNetworkFilter) &&
            (interactionTypeFilter === 'all' || interactionTypeFilter === 'comment')
        ));
    };

    const handleSelectMessage = (id: number, userName: string) => {
        if (selectedMessageId === id) {
            setSelectedMessageId(null);
            setSelectedChat([]);
            setSelectedUserName(null);
            setChatType('');
        } else {
            setChatType('message');
            setSelectedChat([
                { id: 1, text: 'Hola, ¿cómo estás?', fromUser: false },
                { id: 2, text: '¿Puedes enviarme más información?', fromUser: true }
            ]);
            setSelectedCommentId(null);
            setSelectedCommentUserName(null);
            setSelectedUserName(userName);
            setPublicationInfo(null);
            setSelectedMessageId(id);
            setSelectedPublicationId(null);
        }
    };

    const handleSelectPublication = (id: number, socialNetwork: string) => {
        if (selectedPublicationId === id) {
            setSelectedPublicationId(null);
            setSelectedChat([]);
            setPublicationInfo(null);
            setChatType('');
        } else {
            setChatType('comments');
            setSelectedChat([
                { id: 1, text: 'Me encanta!', fromUser: false, userName: 'Laura Gomez' },
                { id: 2, text: '¿Hasta cuándo es válida?', fromUser: false, userName: 'Mario Ruiz' }
            ]);
            setSelectedCommentId(null);
            setSelectedCommentUserName(null);
            setSelectedUserName(null);
            setPublicationInfo(`Publicación de ${socialNetwork}`);
            setSelectedMessageId(null);
            setSelectedPublicationId(id);
        }
    };

    const handleSelectComment = (commentId: number, userName: string) => {
        if (selectedCommentId === commentId) {
            setSelectedCommentId(null);
            setSelectedCommentUserName(null);
        } else {
            setSelectedCommentId(commentId);
            setSelectedCommentUserName(userName);
        }
    };

    const handleSendMessage = (message: string) => {
        setSelectedChat([...selectedChat, { id: selectedChat.length + 1, text: message, fromUser: true }]);
    };

    return (
        <div className="text-black h-screen flex flex-col">
            {/* Bloque Superior con Filtros y Título */}
            <div className="border-b p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Todas las Interacciones</h1>
                    <button
                        onClick={toggleFilters}
                        className={`flex items-center rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'}`}
                    >
                        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                        <div>Filtros</div>
                    </button>
                </div>

                {/* Filtros */}
                {filtersVisible && (
                    <div className="flex justify-between mt-4">
                        <FilterSelect
                            label="Red Social"
                            id="social-network-filter"
                            options={[
                                { value: 'all', label: 'Ver todo' },
                                { value: 'facebook', label: 'Facebook' },
                                { value: 'instagram', label: 'Instagram' },
                            ]}
                            value={socialNetworkFilter}
                            onChange={setSocialNetworkFilter}
                        />
                        <FilterSelect
                            label="Tipo de Interacción"
                            id="interaction-type-filter"
                            options={[
                                { value: 'all', label: 'Ver todo' },
                                { value: 'direct', label: 'Mensaje' },
                                { value: 'comment', label: 'Comentario' },
                            ]}
                            value={interactionTypeFilter}
                            onChange={setInteractionTypeFilter}
                        />

                        <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                            <button
                                className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black border-none"
                                onClick={resetFilters}
                            >
                                <XMarkIcon className="h-5 w-5 mr-2" />
                                <div>Limpiar Todo</div>
                            </button>
                        </div>
                        <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                            <button
                                className="flex items-center text-blue-500 underline px-4 py-2 hover:text-black border-none"
                                onClick={applyFilters}
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                <div>Aplicar el Filtro</div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bloque Inferior con Lista de Interacciones y Chat */}
            <div className="flex flex-1">
                {/* Columna Izquierda con Lista de Interacciones/Publicaciones */}
                <div className="w-1/2 border-r p-4 overflow-y-auto">
                    <h2 className="text-md font-bold mb-2">Seleccione una interacción para atender</h2>
                    <InteractionList
                        messages={filteredMessages}
                        publications={filteredPublications}
                        selectedMessageId={selectedMessageId}
                        selectedPublicationId={selectedPublicationId}
                        onSelectMessage={(id) => handleSelectMessage(id, filteredMessages.find(msg => msg.id === id)?.userName || '')}
                        onSelectPublication={(id) => handleSelectPublication(id, filteredPublications.find(pub => pub.id === id)?.socialNetwork || '')}
                    />
                </div>

                {/* Columna Derecha con Chat o Comentarios */}
                <div className="w-1/2 p-4">
                    <ChatView
                        chatContent={selectedChat}
                        onSendMessage={handleSendMessage}
                        chatType={chatType}
                        selectedCommentId={selectedCommentId}
                        selectedCommentUserName={selectedCommentUserName}
                        selectedUserName={selectedUserName}
                        publicationInfo={publicationInfo}
                        onSelectComment={handleSelectComment}
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;
