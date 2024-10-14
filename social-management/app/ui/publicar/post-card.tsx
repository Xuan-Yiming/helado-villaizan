import React from 'react';
import Image from 'next/image';

import {  
    ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/solid'; 

import { 
    PaperAirplaneIcon
} 
from '@heroicons/react/24/outline'; 
import Link from 'next/link';

interface PostCardProps {
    postTime: string;
    image: string;
    content: string;
    socialIcon?: React.ReactNode;
    ifPosted: boolean;
    link: string;
}

const PostCard: React.FC<PostCardProps> = ({ postTime,image, content, socialIcon, link, ifPosted }) => (
    <li
        className=" min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4"
    >
        <div className='flex flex-row justify-between '>
            <div className="flex justify-between w-full md:w-auto">
                <div className="flex items-center">
                    <div className="w-10 text-black md:w-10">
                        {socialIcon}
                    </div>

                    <Image 
                        src={image} 
                        alt="Post image" 
                        className="mt-4 md:mt-0 md:ml-4 border rounded-md" 
                        width={50}
                        height={50}
                    />
                </div>
            </div>

            <div className='flex flex-col justify-between w-full md:w-auto'>
                <p className="p-2 pb-0 space-x-4">
                    {content.length > 50 ? `${content.substring(0, 50)}...` : content}
                </p>
                <div className="p-2 pt-0 text-xs text-gray-700">{postTime}</div>
            </div>
        </div>

        
        <Link 
            href={link}
            className="flex items-center text-blue-500 hover:text-blue-700">
             {ifPosted ? <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-1" /> : <PaperAirplaneIcon className="h-5 w-5 mr-1" /> } 
            <span>{ifPosted ? 'Abrir' : 'Publicar'}</span>
        </Link>
    </li>
);

export default PostCard;