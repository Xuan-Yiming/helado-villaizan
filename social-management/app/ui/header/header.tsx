'use client';

import React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import SocialHubLogo from '../icons/social-hub-logo';
import useScroll from '@/app/hooks/use-scroll';
import { cn } from '@/app/lib/utils';

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          // Cambié el color de fondo a #BD181E
          'bg-[#BD181E] backdrop-blur-lg': scrolled, // color #BD181E cuando se hace scroll
          'bg-[#BD181E]': selectedLayout, // color #BD181E fijo
        }
      )}
      style={{ marginTop: 0, paddingTop: 0 }} // Eliminar márgenes o padding extras
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
