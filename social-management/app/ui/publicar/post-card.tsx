import React from 'react';
import Image from 'next/image';

import FacebookLogo from '@/app/ui/icons/facebook';
import TiktokLogo from '@/app/ui/icons/tiktok';
import InstagramLogo from '@/app/ui/icons/instagram';

import { Post } from '@/app/lib/types';

import {  
    ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/solid'; 

import { 
    PaperAirplaneIcon
} 
from '@heroicons/react/24/outline'; 
import Link from 'next/link';

interface PostCardProps {
    post:Post
}

export default function PostCard ({post}:PostCardProps ) {
    return(
        <li
            className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4"
        >
            <div className='flex flex-row justify-between '>
            <div className="flex justify-between w-full md:w-auto">
                <div className="flex items-center">
                <div className="w-10 text-black md:w-10">
                    {post.red_social.toLowerCase() === 'facebook' && <FacebookLogo />}
                    {post.red_social.toLowerCase() === 'tiktok' && <TiktokLogo />}
                    {post.red_social.toLowerCase() === 'instagram' && <InstagramLogo />}
                </div>
        
                {post.media && (
                    <Image 
                    src={post.media} 
                    alt="Post image" 
                    className="mt-4 md:mt-0 md:ml-4 border rounded-md" 
                    width={50}
                    height={50}
                    loader={({ src }) => src} // Load image from URL
                    />
                )}
                </div>
            </div>
        
            <div className='flex flex-col justify-between w-full md:w-auto'>
                <p className="p-2 pb-0 space-x-4">
                {post.contenido && (post.contenido.length > 50 ? `${post.contenido.substring(0, 50)}...` : post.contenido)}
                </p>
                <div className="p-2 pt-0 text-xs text-gray-700">
                {post.fecha_publicacion && new Date(post.fecha_publicacion).toLocaleString()}
                </div>
            </div>
            </div>
        
            <Link 
            href={post.link || '#'}
            className="flex items-center text-blue-500 hover:text-blue-700">
            {post.estado === 'published' ? <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-1" /> : <PaperAirplaneIcon className="h-5 w-5 mr-1" /> } 
            <span>{post.estado === 'published' ? 'Abrir' : 'Publicar'}</span>
            </Link>
        </li>
    );
};
