'use client';

import React, { useState } from 'react';
import {
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    ArrowTopRightOnSquareIcon,
    HeartIcon,
    StarIcon
} from '@heroicons/react/24/solid';

import FacebookLogo from '@/app/ui/icons/facebook';
import TiktokLogo from '@/app/ui/icons/tiktok';
import InstagramLogo from '@/app/ui/icons/instagram';

import FilterSelect from '@/app/ui/mensajes/filter-select';
import MessageCard from '@/app/ui/mensajes/message-card';

const Page = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [responseFilter, setResponseFilter] = useState('all');
    const [tagsFilter, setTagsFilter] = useState('all');
    const [socialNetworkFilter, setSocialNetworkFilter] = useState('all');
    const [postTypeFilter, setPostTypeFilter] = useState('all');

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setResponseFilter('all');
        setTagsFilter('all');
        setSocialNetworkFilter('all');
        setPostTypeFilter('all');
    };

    return (
        <div
            className='text-black'
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Todos los Mensajes</h1>
                <button
                    onClick={toggleFilters}
                    className={`flex items-center rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'
                        }`}
                >
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                    <div>Filtrar</div>
                </button>
            </div>
            {/* Filters */}
            {filtersVisible && (
                <div className="flex justify-between mt-4">
                    <FilterSelect
                        label="Respondido"
                        id="response-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'responded', label: 'Respondido' },
                            { value: 'not-responded', label: 'No respondido' },
                        ]}
                        value={responseFilter}
                        onChange={setResponseFilter}
                    />
                    <FilterSelect
                        label="Tags"
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
                    <FilterSelect
                        label="Rede Social"
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
                        label="Tipo de publicacion"
                        id="post-type-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'image', label: 'Imagen' },
                            { value: 'video', label: 'Video' },
                        ]}
                        value={postTypeFilter}
                        onChange={setPostTypeFilter}
                    />
                    <div className="flex-1 border border-gray-300 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black"
                            onClick={resetFilters}
                        >
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            <div>Limpiar Todo</div>
                        </button>
                    </div>
                </div>
            )}
            {/* Post */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {/* Example Post */}
                    <MessageCard
                        userName="John Doe"
                        postTime="Hace 2 horas"
                        comment="Este es un comentario de ejemplo"
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. "
                        socialIcon={<FacebookLogo/>}
                        liked={false}
                        saved={false}
                    />
                    <MessageCard
                        userName="John Doe"
                        postTime="Hace 2 horas"
                        comment="Este es un comentario de ejemplo"
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis."
                        socialIcon={<InstagramLogo/>}
                        liked={true}
                        saved={false}
                    />
                    <MessageCard
                        userName="John Doe"
                        postTime="Hace 2 horas"
                        comment="Este es un comentario de ejemplo"
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. "
                        socialIcon={<TiktokLogo/>}
                        liked={false}
                        saved={true}
                    />
            </div>
        </div>
    );
};

export default Page;