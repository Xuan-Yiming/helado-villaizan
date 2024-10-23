'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdjustmentsHorizontalIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

import { load_posts } from '@/app/lib/data';
import { Post } from '@/app/lib/types';

import FilterSelect from '@/app/ui/mensajes/filter-select';
import PostList from '@/app/ui/publicar/post-list';

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [responseFilter, setResponseFilter] = useState('all');
    const [tagsFilter, setTagsFilter] = useState('all');
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [postTypeFilter, setPostTypeFilter] = useState('all');
    const [posts, setPosts] = useState<Post[]>([]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setResponseFilter('all');
        setTagsFilter('all');
        setSocialNetworkFilter('all');
        setPostTypeFilter('all');
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await load_posts(0, 1, socialNetworkFilter, postTypeFilter, responseFilter, tagsFilter);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [socialNetworkFilter, postTypeFilter, responseFilter, tagsFilter]);



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
                            { value: 'twitter', label: 'Twitter' },
                            { value: 'tiktok', label: 'Tiktok' },
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
                            { value: 'responded', label: 'Publicado' },
                            { value: 'not-responded', label: 'Programado' },
                        ]}
                        value={responseFilter}
                        onChange={setResponseFilter}
                    />
                    <FilterSelect
                        label="#Tags"
                        id="tags-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'tag1', label: 'Tag 1' },
                            { value: 'tag2', label: 'Tag 2' },
                            { value: 'tag3', label: 'Tag 3' },
                        ]}
                        value={tagsFilter}
                        onChange={setTagsFilter}
                    />


                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black border-none"
                            onClick={resetFilters}
                        >
                            {/* <XMarkIcon className="h-5 w-5 mr-2" /> */}
                            <div>Limpiar Todo</div>
                        </button>
                    </div>
                </div>
            )}
            {/* Post */}
            <PostList
                initialPosts={posts}
                socialNetworkFilter={socialNetworkFilter}
                postTypeFilter={postTypeFilter}
                responseFilter={responseFilter}
                tagsFilter={tagsFilter}
            /> 
        </div>
    );
};

export default Page;