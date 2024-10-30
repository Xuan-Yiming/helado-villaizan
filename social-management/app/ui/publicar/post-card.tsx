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

export default function PostCard({ post }: PostCardProps) {
    return (
      <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
        <div className="flex flex-row justify-between">
          <div className="flex justify-between w-full md:w-auto">
            <div className="flex items-center">
              <div className="flex items-center space-x-4 w-50 md:w-50">
                {post.social_media.includes('facebook') && <FacebookLogo />}
                {post.social_media.includes('tiktok') && <TiktokLogo />}
                {post.social_media.includes('instagram') && <InstagramLogo />}
              </div>
  
              {post.thumbnail && (
                post.thumbnail.endsWith('.mp4') || post.thumbnail.endsWith('.mov') ? (
                  <div className="relative w-12 h-12 ml-4">
                    <video 
                      src={post.thumbnail} 
                      className="w-full h-full object-cover rounded-md" 
                      muted 
                      autoPlay 
                      loop 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.752 11.168l-4.596 2.664A1 1 0 019 12.96V9.04a1 1 0 011.156-.98l4.596 2.664a1 1 0 010 1.744z"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-12 h-12 ml-4">
                    <Image
                      src={post.thumbnail}
                      alt="Post image"
                      className="w-full h-full object-cover rounded-md"
                      width={50}
                      height={50}
                      loader={({ src }) => src} // Load image from URL
                    />
                  </div>
                )
              )}
            </div>
          </div>
  
          <div className="flex flex-col justify-between w-full md:w-auto">
            <p className="p-2 pb-0 space-x-4">
              {post.content && (post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content)}
            </p>
            <div className="p-2 pt-0 text-xs text-gray-700">
              {post.post_time && new Date(post.post_time).toLocaleString()}
            </div>
          </div>
        </div>
  
        {post.status !== 'publicado' && (
          <Link 
            href={`/pages/publicaciones/crear?id=${post.id}`}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-1" />
            <span>Publicar</span>
          </Link>
        )}
      </li>
    );
  }
  