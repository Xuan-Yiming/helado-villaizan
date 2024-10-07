'use client';

import React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import SocialHubLogo from '../icons/social-hub-logo';
import useScroll from '@/app/hooks/use-scroll';

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 ${
        scrolled ? 'border-b border-gray-200 bg-[#BD181E]/75 backdrop-blur-lg' : ''
      } ${selectedLayout ? 'border-b border-gray-200 bg-[#BD181E]' : ''}`}
    >
      <div className="flex h-[79px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-row space-x-3 items-center justify-center md:hidden">
            <SocialHubLogo height={100} width={200} />
          </div>
        </div>

        <div className="hidden md:block">
          <div className="h-10 w-10 rounded-full bg-zinc-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">AD</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Header;
