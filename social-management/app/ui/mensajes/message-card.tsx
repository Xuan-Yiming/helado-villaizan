import React from 'react';
import { 
    HeartIcon as SolidHeartIcon, 
    StarIcon as SolidStarIcon, 
    ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/solid'; 

import { 
    HeartIcon as OutlinedHeartIcon,
    StarIcon as OutlinedStarIcon
} 
from '@heroicons/react/24/outline'; 

interface MessgaeCardProps {
    userName: string;
    postTime: string;
    comment: string;
    content: string;
    socialIcon?: React.ReactNode;
    liked?: boolean;
    saved?: boolean;
}

const MessgaeCard: React.FC<MessgaeCardProps> = ({ userName, postTime, comment, content, socialIcon, liked, saved }) => (
    <div
        className="border rounded border-gray-300 p-4 mb-4 rounded bg-white max-w-sm mx-auto flex flex-col justify-between"
        style={{ borderRadius: '20px', height: 'auto' }}
    >
        <div className="flex justify-between">
            <div className="flex items-center">
                <div className="w-10 text-black md:w-10">
                    {socialIcon}
                </div>
                <h3 className="font-bold">{userName}</h3>
            </div>
            <div className="bg-gray-200 rounded p-2 text-xs text-gray-700" style={{ borderRadius: '20px' }}>{postTime}</div>
        </div>
        <p className="text-sm mt-2 text-gray-600">{comment}</p>
        <p className="mt-6 mb-6 space-x-4">{content}</p>

        <div className="flex justify-end mt-auto">
            <button className="flex items-center text-red-500 hover:text-red-700 mr-2">
                {liked ? <SolidHeartIcon className="h-5 w-5 mr-1" /> : <OutlinedHeartIcon className="h-5 w-5 mr-1" />}
                <span>Like</span>
            </button>
            <button className="flex items-center text-yellow-500 hover:text-yellow-700 mr-2">
                {saved ? <SolidStarIcon className="h-5 w-5 mr-1" /> : <OutlinedStarIcon className="h-5 w-5 mr-1" />}
                <span>Guardar</span>
            </button>
            <button className="flex items-center text-blue-500 hover:text-blue-700">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-1" />
                <span>Abrir</span>
            </button>
        </div>
    </div>
);

export default MessgaeCard;