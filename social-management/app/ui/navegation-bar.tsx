'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const NavigationBar: React.FC = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const path = usePathname()
  useEffect(() => {
     // Use asPath to get the current path
    const segments = path.split('/').filter(segment => segment);
    const items = segments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + segments.slice(0, index + 1).join('/'),
    }));
    setNavItems(items);
  }, [path]);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    router.push(href); // Use router.push to navigate
  };

  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex items-center space-x-2">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`flex items-center ${
              index === activeIndex ? 'font-bold text-black' : 'text-[#BD181E]'
            }`}
            onClick={() => handleNavClick(index, item.href)}
          >
            <Link href={item.href}>
              {item.label}
            </Link>
            {index < navItems.length - 1 && <span className="mx-2">{'>'}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
