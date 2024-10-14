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
import MessageCard from '@/app/ui/publicar/post-card';

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
                <h1 className="text-xl font-bold">Todas las publicaciones</h1>
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

            <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
                {/* Example Post */}
                <MessageCard
                    postTime="Hace 2 horas"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. "
                    socialIcon={<FacebookLogo />}
                    image='/images/Logo-red.png'
                    ifPosted={true}
                    link=""
                />
                <MessageCard
                    postTime="Hace 2 horas"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis."
                    socialIcon={<InstagramLogo />}
                    image='/images/Logo-red.png'
                    ifPosted={true}
                    link=""
                />
                <MessageCard
                    postTime="Hace 2 horas"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nibh blandit, iaculis velit vel, mollis lectus. Aliquam purus nulla, hendrerit sed ullamcorper sed, sagittis mattis turpis. "
                    socialIcon={<TiktokLogo />}
                    image='/images/Logo-red.png'
                    ifPosted={false}
                    link=""
                />
            </ul>
        </div>
    );
};

export default Page;