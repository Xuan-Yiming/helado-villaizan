// page.tsx
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
import { InteractionPublication, ChatMessage } from '@/app/lib/types';

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [interactionTypeFilter, setInteractionTypeFilter] = useState('all');
    const [allPublications, setAllPublications] = useState<InteractionPublication[]>([]);
    const [filteredPublications, setFilteredPublications] = useState<InteractionPublication[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatMessage[]>([]);
    const [chatType, setChatType] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [selectedCommentUserName, setSelectedCommentUserName] = useState<string | null>(null);
    const [publicationInfo, setPublicationInfo] = useState<string | null>(null);
    const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const hasLoaded = useRef(false);
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga

    // Fetch todas las publicaciones de Facebook e Instagram
    const fetchAllPublications = async () => {
        setIsLoading(true); // Activar indicador de carga
        try {
            const fbPublications = await fetch('/api/facebook/publicaciones').then(res => res.json());
            const igPublications = await fetch('/api/instagram/publicaciones').then(res => res.json());
            const combinedPublications = [...fbPublications, ...igPublications];
            setAllPublications(combinedPublications);
            setFilteredPublications(combinedPublications);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        } finally {
            setIsLoading(false); // Desactivar indicador de carga después de obtener las publicaciones
        }
    };

    useEffect(() => {
        if (!hasLoaded.current) {
            fetchAllPublications();
            hasLoaded.current = true;
        }
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setSocialNetworkFilter('all');
        setInteractionTypeFilter('all');
        setFilteredPublications(allPublications);
    };

    const handleAplicarFiltro = () => {
        const filtered = allPublications.filter((publication) => {
            const matchesNetwork = socialNetworkFilter === 'all' || publication.socialNetwork === socialNetworkFilter;
            const matchesInteractionType = interactionTypeFilter === 'all' || interactionTypeFilter === 'comentarios';
            return matchesNetwork && matchesInteractionType;
        });
        setFilteredPublications(filtered);
    };

    const handleSendResponse = async (message: string) => {
        if (!selectedCommentId || !selectedPublicationId) {
            console.warn("No hay comentario o publicación seleccionada para responder.");
            return;
        }

        const network = filteredPublications.find(pub => pub.postId === selectedPublicationId)?.socialNetwork;
    
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

    const handleSelectPublication = async (id: string) => {
        const selectedPublication = filteredPublications.find(pub => pub.postId === id);
        setSelectedPublicationId(selectedPublicationId === id ? null : id);
        
        // Restablecer el comentario seleccionado
        setSelectedCommentId(null);
        setSelectedCommentUserName(null);
    
        if (selectedPublication) {
            try {
                const commentsResponse = await fetch(`/api/${selectedPublication.socialNetwork}/comentarios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ postId: id })
                });
        
                const comments: ChatMessage[] = await commentsResponse.json();
        
                const sortedComments = comments
                    .map((comment: ChatMessage) => ({
                        ...comment,
                        formattedDate: new Date(comment.timestamp || "").toLocaleString()
                    }))
                    .sort((b, a) => (new Date(b.timestamp || "").getTime()) - (new Date(a.timestamp || "").getTime()));
        
                setSelectedChat(sortedComments || []);
                setPublicationInfo(`Publicación de ${selectedPublication.socialNetwork}`);
                setChatType('comments');
            } catch (error) {
                console.error("Error al obtener comentarios:", error);
            }
        }
    };

    const paginatedPublications = Array.isArray(filteredPublications) 
        ? filteredPublications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
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
                            <div className="loader">Cargando...</div> {/* Spinner de carga */}
                        </div>
                    ) : (
                        <InteractionList
                            items={paginatedPublications}
                            selectedPublicationId={selectedPublicationId}
                            onSelectPublication={(id) => handleSelectPublication(id)}
                        />
                    )}
                    <div className="flex justify-between items-center mt-4 p-4 border-t bg-gray-50">
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                            Anterior
                        </button>
                        <span>Página {currentPage} de {Math.ceil(filteredPublications.length / itemsPerPage)}</span>
                        <button 
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={(currentPage * itemsPerPage) >= filteredPublications.length}
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
