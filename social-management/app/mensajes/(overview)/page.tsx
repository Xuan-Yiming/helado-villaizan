'use client';

import React, { useState } from 'react';
import {
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    ArrowTopRightOnSquareIcon,
    HeartIcon,
    StarIcon
} from '@heroicons/react/24/solid';
import FilterSelect from '@/app/ui/Mensajes/filter-select';
import FacebookLogo from '@/app/ui/icons/facebook';

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
            <div className="mt-6">
                <div>
                    {/* Example Post */}
                    <div
                        className="border rounded border-gray-300 p-4 mb-4 rounded bg-white max-w-xl mx-auto"
                        style={{ borderRadius: '20px' }}
                    >
                        {/* Header */}
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <div className="w-10 text-black md:w-10">
                                    <FacebookLogo />
                                </div>
                                <h3 className="font-bold">User Name</h3>
                            </div>
                            <div className="bg-gray-200 rounded p-2 text-xs text-gray-700" style={{ borderRadius: '20px' }}>Hace 15 min</div>
                        </div>
                        <p className="text-sm text-gray-600">Commanted by User on Date</p>
                        <p className="mt-2">This is an example of a Facebook-like post. It can contain text, images, videos, etc.</p>

                        <div className="flex justify-end mt-4 space-x-4">
                            <button className="flex items-center text-red-500 hover:text-red-700">
                                <HeartIcon className="h-5 w-5 mr-1" />
                                <span>Like</span>
                            </button>
                            <button className="flex items-center text-yellow-500 hover:text-yellow-700">
                                <StarIcon className="h-5 w-5 mr-1" />
                                <span>Guardar</span>
                            </button>
                            <button className="flex items-center text-blue-500 hover:text-blue-700">
                                <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-1" />
                                <span>Abrir</span>
                            </button>
                        </div>
                    </div>
                    {/* Add more posts as needed */}
                </div>
            </div>
        </div>
    );
};

export default Page;