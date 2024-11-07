'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    AdjustmentsHorizontalIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/solid';

import FilterSelect from '@/app/ui/interacciones/filter-select';
import InteractionList from '@/app/ui/interacciones/interaction-list';
import ChatView from '@/app/ui/interacciones/chat-view';
import { InteractionPublication, ChatMessage, InteractionMessage } from '@/app/lib/types';

type Interaction = 
    | (InteractionPublication & { type: 'publication'; userName?: string })
    | (InteractionMessage & { type: 'message'; userName: string });

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [interactionTypeFilter, setInteractionTypeFilter] = useState('all');
    const [allConversations, setAllConversations] = useState<Interaction[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Interaction[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatMessage[]>([]);
    const [chatType, setChatType] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [selectedCommentUserName, setSelectedCommentUserName] = useState<string | null>(null);
    const [publicationInfo, setPublicationInfo] = useState<string | null>(null);
    const [selectedInteractionId, setSelectedInteractionId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const hasLoaded = useRef(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllConversations = async () => {
        setIsLoading(true);
        try {
            const fbConversations = await fetch('/api/facebook/conversaciones').then(res => res.json());
            const igPublications = await fetch('/api/instagram/publicaciones').then(res => res.json());
            const fbPublications = await fetch('/api/facebook/publicaciones').then(res => res.json());

            const combinedInteractions = [
                ...fbPublications.map((pub: InteractionPublication) => ({ ...pub, type: 'publication' })),
                ...igPublications.map((pub: InteractionPublication) => ({ ...pub, type: 'publication' })),
                ...fbConversations.map((msg: InteractionMessage) => ({ ...msg, type: 'message' })),
            ];

            setAllConversations(combinedInteractions);
            setFilteredConversations(combinedInteractions);
        } catch (error) {
            console.error("Error al obtener conversaciones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!hasLoaded.current) {
            fetchAllConversations();
            hasLoaded.current = true;
        }
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setSocialNetworkFilter('all');
        setInteractionTypeFilter('all');
        setFilteredConversations(allConversations);
    };

    const handleAplicarFiltro = () => {
        if (socialNetworkFilter === 'all' && interactionTypeFilter === 'all') {
            fetchAllConversations();
        } else {
            const filtered = allConversations.filter((interaction: Interaction) => {
                const matchesNetwork = socialNetworkFilter === 'all' || interaction.socialNetwork === socialNetworkFilter;
                const matchesInteractionType =
                    interactionTypeFilter === 'all' ||
                    (interactionTypeFilter === 'comentarios' && interaction.type === 'publication') ||
                    (interactionTypeFilter === 'mensajes' && interaction.type === 'message');
                return matchesNetwork && matchesInteractionType;
            });
            setFilteredConversations(filtered);
        }
    };

    const handleSendResponse = async (message: string) => {
        if (!selectedCommentId || !selectedInteractionId) {
            console.warn("No hay comentario o publicación seleccionada para responder.");
            return;
        }

        const network = filteredConversations.find(
            (pub) => pub.type === 'publication' && pub.postId === selectedInteractionId
        )?.socialNetwork;

        try {
            const response = await fetch(`/api/${network}/responder-comentario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commentId: selectedCommentId,
                    message: message
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Respuesta enviada:", data);
            } else {
                console.error("Error al responder el comentario:", data.error);
            }
        } catch (error) {
            console.error("Error en la solicitud de respuesta:", error);
        }
    };

    const handleSelectInteraction = async (id: string) => {
        setSelectedInteractionId(id);
        const selectedInteraction = filteredConversations.find(
            (interaction) => (interaction.type === 'message' ? String(interaction.id) : interaction.postId) === id
        ) as Interaction;
    
        if (!selectedInteraction) return;
    
        try {
            if (selectedInteraction.type === 'publication') {
                const commentsResponse = await fetch(`/api/${selectedInteraction.socialNetwork}/comentarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId: id })
                });
                const comments = await commentsResponse.json();
                setSelectedChat(comments);
                setPublicationInfo(`Publicación de ${selectedInteraction.socialNetwork}`);
                setChatType('comments');
                setSelectedCommentId(null);
                setSelectedCommentUserName(null);
            } else if (selectedInteraction.type === 'message') {
                // Llama al nuevo endpoint de mensajes con el conversationId
                const messagesResponse = await fetch(`/api/facebook/mensajes?conversationId=${id}`);
                const messages = await messagesResponse.json();
                setSelectedChat(messages);
                setPublicationInfo(`Conversación con ${selectedInteraction.userName || 'Usuario desconocido'}`);
                setChatType('message');
                setSelectedCommentId(null);
                setSelectedCommentUserName(null);
            }
        } catch (error) {
            console.error("Error al obtener mensajes/comentarios:", error);
        }
    };
    
    const paginatedConversations = Array.isArray(filteredConversations) 
        ? filteredConversations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
        : [];

    return (
        <div className="text-black h-screen flex flex-col">
            <div className="border-b p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Todas las Interacciones</h1>
                    <button
                        onClick={toggleFilters}
                        className={`flex items-center rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'}`}
                    >
                        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                        <div>Filtrar</div>
                    </button>
                </div>

                {filtersVisible && (
                    <div className="flex justify-between mt-4">
                        <FilterSelect
                            label="Red Social"
                            id="social-network-filter"
                            options={[
                                { value: 'all', label: 'Ver todo' },
                                { value: 'facebook', label: 'Facebook' },
                                { value: 'instagram', label: 'Instagram' }
                            ]}
                            value={socialNetworkFilter}
                            onChange={setSocialNetworkFilter}
                        />

                        <FilterSelect
                            label="Tipo de Interacción"
                            id="interaction-type-filter"
                            options={[
                                { value: 'all', label: 'Ver todo' },
                                { value: 'mensajes', label: 'Mensajes' },
                                { value: 'comentarios', label: 'Comentarios' }
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
                                <div>Limpiar Filtro</div>
                            </button>
                        </div>

                        <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                            <button
                                className="flex items-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 border-none"
                                onClick={handleAplicarFiltro}
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                <div>Aplicar filtro</div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1">
                <div className="w-1/2 border-r p-4">
                    <h2 className="text-md font-bold mb-2">Seleccione una interacción para atender</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="loader">Cargando...</div>
                        </div>
                    ) : (
                        <InteractionList 
                            items={paginatedConversations} 
                            selectedInteractionId={selectedInteractionId} 
                            onSelectInteraction={handleSelectInteraction} 
                        />
                    )}
                    <div className="flex justify-between items-center mt-4 p-4 border-t bg-gray-50">
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                            Anterior
                        </button>
                        <span>Página {currentPage} de {Math.ceil(filteredConversations.length / itemsPerPage)}</span>
                        <button 
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={(currentPage * itemsPerPage) >= filteredConversations.length}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                            Siguiente
                        </button>
                    </div>
                </div>
                <div className="w-1/2 p-4">
                    <ChatView
                        chatContent={selectedChat}
                        onSendMessage={handleSendResponse}
                        chatType={chatType}
                        selectedCommentId={selectedCommentId}
                        selectedCommentUserName={selectedCommentUserName}
                        selectedUserName={null}
                        publicationInfo={publicationInfo}
                        onSelectComment={(commentId, userName) => {
                            setSelectedCommentId(commentId);
                            setSelectedCommentUserName(userName);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;
