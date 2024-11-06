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

    const handleSelectPublication = (id: string, socialNetwork: string) => {
        const selectedPublication = filteredPublications.find(pub => pub.postId === id);
        
        setSelectedPublicationId(selectedPublicationId === id ? null : id);
    
        // Mapea los comentarios solo si existen
        setSelectedChat(
            selectedPublication && selectedPublication.comments
                ? selectedPublication.comments.map(comment => ({
                    id: comment.id,
                    text: comment.text,
                    fromUser: false,
                    userName: comment.userName
                }))
                : []
        );
    
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
                        chatContent={selectedChat} // Asegúrate de que `selectedChat` sea ChatMessage[]
                        onSendMessage={() => {}}
                        chatType={chatType}
                        selectedCommentId={selectedCommentId} // Asegúrate de que sea del tipo string | null si corresponde
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
