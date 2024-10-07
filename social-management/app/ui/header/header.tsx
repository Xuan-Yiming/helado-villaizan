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
          // Cambié el color de fondo a transparente o al color que prefieras
          'border-b border-gray-200 bg-transparent backdrop-blur-lg': scrolled, // fondo transparente cuando se hace scroll
          'border-b border-gray-200 bg-transparent': selectedLayout, // fondo transparente o color personalizado
        },
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <SocialHubLogo height={100} width={200} />
          </div>
        </div>

        <div className="hidden md:block">
          <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">AD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
