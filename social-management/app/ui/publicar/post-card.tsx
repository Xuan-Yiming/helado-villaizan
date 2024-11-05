import React from "react";
import Image from "next/image";

import FacebookLogo from "@/app/ui/icons/facebook";
import TiktokLogo from "@/app/ui/icons/tiktok";
import InstagramLogo from "@/app/ui/icons/instagram";

import { Post } from "@/app/lib/types";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "publicado":
                return "bg-green-500";
            case "programado":
                return "bg-blue-500";
            case "borrador":
                return "bg-gray-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "publicado":
                return "Publicado";
            case "programado":
                return "Programado";
            case "borrador":
                return "Borrador";
            default:
                return "";
        }
    };

    return (
      <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
        <div className="flex flex-row justify-between">
          <div className="flex justify-between w-full md:w-auto">
            <div className="flex items-center mr-12"> {/* Se ajustó el margen derecho */}
              <div className="flex items-center space-x-2 w-[100px]">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(post.status)}`}></div> {/* Bolita de estado */}
                <span className="text-xs font-semibold text-gray-700">{getStatusLabel(post.status)}</span>
              </div>

              {/* Logos de redes sociales */}
              {post.social_media.includes('facebook') && <FacebookLogo />}
              {post.social_media.includes('tiktok') && <TiktokLogo />}
              {post.social_media.includes('instagram') && <InstagramLogo />}
            </div>
  
            {post.thumbnail && (
              post.thumbnail.endsWith('.mp4') || post.thumbnail.endsWith('.mov') ? (
                <div className="relative w-12 h-12 ml-12"> {/* Aumentado el margen izquierdo para mayor separación */}
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
                <div className="relative w-12 h-12 ml-12"> {/* Aumentado el margen izquierdo para mayor separación */}
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
