// page.tsx
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
import { InteractionPublication, ChatMessage } from '@/app/lib/types';
import { format } from 'date-fns';

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [filteredPublications, setFilteredPublications] = useState<InteractionPublication[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatMessage[]>([]);
    const [chatType, setChatType] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [selectedCommentUserName, setSelectedCommentUserName] = useState<string | null>(null);
    const [publicationInfo, setPublicationInfo] = useState<string | null>(null);
    const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null); // Cambio a string para que coincida con el postId
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    const fetchFacebookComments = async () => {
        try {
            const fbComments = await fetch('/api/facebook/comentarios').then(res => res.json());
            setFilteredPublications(fbComments);
        } catch (error) {
            console.error("Error al obtener comentarios de Facebook:", error);
        }
    };

    useEffect(() => {
        fetchFacebookComments();
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setSocialNetworkFilter('all');
        fetchFacebookComments();
    };

    const handleSendResponse = async (message: string) => {
        if (!selectedCommentId) {
            console.warn("No hay comentario seleccionado para responder.");
            return;
        }
    
        try {
            const response = await fetch('/api/facebook/responder-comentario', {
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
                // Aquí puedes actualizar el estado o interfaz para indicar que el comentario ha sido respondido
            } else {
                console.error("Error al responder el comentario:", data.error);
            }
        } catch (error) {
            console.error("Error en la solicitud de respuesta:", error);
        }
    };

    const handleSelectPublication = (id: string, socialNetwork: string) => {
        const selectedPublication = filteredPublications.find(pub => pub.postId === id);
        setSelectedPublicationId(selectedPublicationId === id ? null : id);
        
        // Restablecer el comentario seleccionado
        setSelectedCommentId(null);
        setSelectedCommentUserName(null);
    
        // Ordena los comentarios en orden descendente de fecha usando el timestamp original
        const sortedComments = selectedPublication?.comments
            .map(comment => ({
                id: comment.id,
                text: comment.text,
                fromUser: false,
                userName: comment.userName,
                timestamp: comment.timestamp, // Conserva el timestamp para ordenarlo
                formattedDate: new Date(comment.timestamp).toLocaleString() // Formato de fecha amigable
            }))
            .sort((b, a) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Orden descendente por fecha
    
        setSelectedChat(sortedComments || []); // Si no hay comentarios, pasa un array vacío
        console.log(sortedComments); // Verifica el orden de los comentarios en la consola
        setPublicationInfo(`Publicación de ${socialNetwork}`);
        setChatType('comments');
    };
    
    
    const paginatedPublications = filteredPublications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                        <div>Filtros</div>
                    </button>
                </div>

                {filtersVisible && (
                    <div className="flex justify-between mt-4">
                        <FilterSelect
                            label="Red Social"
                            id="social-network-filter"
                            options={[{ value: 'all', label: 'Ver todo' }, { value: 'facebook', label: 'Facebook' }]}
                            value={socialNetworkFilter}
                            onChange={setSocialNetworkFilter}
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
                    </div>
                )}
            </div>

            <div className="flex flex-1">
                <div className="w-1/2 border-r p-4">
                    <h2 className="text-md font-bold mb-2">Seleccione una interacción para atender</h2>
                    <InteractionList
                        items={paginatedPublications}
                        selectedPublicationId={selectedPublicationId}
                        onSelectPublication={(id) => handleSelectPublication(id, paginatedPublications.find(pub => pub.postId === id)?.socialNetwork || 'facebook')}
                    />
                    <div className="flex justify-between items-center mt-4 p-4 border-t bg-gray-50">
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {Math.ceil(filteredPublications.length / itemsPerPage)}</span>
                        <button 
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={(currentPage * itemsPerPage) >= filteredPublications.length}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
                <div className="w-1/2 p-4">
                <ChatView
                    chatContent={selectedChat}
                    onSendMessage={handleSendResponse} // Aquí estamos pasando `handleSendResponse`
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
