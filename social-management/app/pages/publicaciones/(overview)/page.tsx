'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AdjustmentsHorizontalIcon, PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { load_posts } from '@/app/lib/database';
import { Post } from '@/app/lib/types';

import FilterSelect from '@/app/ui/interacciones/filter-select';
import PostList from '@/app/ui/publicar/post-list';
import PostCard from '@/app/ui/publicar/post-card';


  
const NUMBER_OF_POSTS_TO_FETCH = 20;

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [responseFilter, setResponseFilter] = useState('all');
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [postTypeFilter, setPostTypeFilter] = useState('all');
    const [posts, setPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const hasLoaded = useRef(false);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setResponseFilter('all');
        setSocialNetworkFilter('all');
        setPostTypeFilter('all');
    };

    const loadMorePosts = async (_offset: number) => {
        try {
            const apiPosts = await load_posts(
                _offset,
                NUMBER_OF_POSTS_TO_FETCH,
                socialNetworkFilter,
                postTypeFilter,
                responseFilter
            );
            setPosts(posts => [...posts, ...apiPosts]);
            setOffset(offset => _offset + NUMBER_OF_POSTS_TO_FETCH);
        } catch (error) {
            console.error('Error loading more posts:', error);
        }
    };

    useEffect(() => {
        if (!hasLoaded.current) {
            loadMorePosts(0);
            hasLoaded.current = true;
        }
    }, []);

    async function reset(){
        setPosts([]);
    }

    const handleAplicarFiltro  = async () => {
        await reset();
        await loadMorePosts(0);
    };


    return (
        <div
            className='text-black'
        >
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Todas las publicaciones</h1>

                <div className="flex items-center">
                <button
                    onClick={toggleFilters}
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'
                        }`}
                >
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                    <div>Filtrar</div>
                </button>

                <Link
                    href="/pages/publicaciones/crear"
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? 'bg-[#BD181E] text-white' : 'border border-black bg-transparent text-black'
                        }`}
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    <div>Nuevo</div>
                </Link>

                </div>

            </div>


            {/* Filters */}
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
                        label="Tipo de Publicación"
                        id="post-type-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'image', label: 'Imagen' },
                            { value: 'video', label: 'Video' },
                        ]}
                        value={postTypeFilter}
                        onChange={setPostTypeFilter}
                    />
                    <FilterSelect
                        label="Estado"
                        id="response-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'publicado', label: 'Publicado' },
                            { value: 'programado', label: 'Programado' },
                            { value: 'borrador', label: 'Borrador' },

                        ]}
                        value={responseFilter}
                        onChange={setResponseFilter}
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
                            onClick={handleAplicarFiltro}
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>Aplicar el Filtro</div>
                        </button>
                    </div>
                </div>
            )}
            {/* Post */}
            <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </ul>
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => loadMorePosts(offset)}
                    className="px-4 py-2 text-[#BD181E] "
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Cargar más'}
                </button>
            </div>
        </div>
    );
};

export default Page;