'use client';

import React, { use, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SideNavItem, UserAccount } from '@/app/lib/types';


import { ChevronDownIcon } from '@heroicons/react/24/solid';
import SocialHubLogo from '../icons/social-hub-logo';
import { get_side_nav } from '@/app/lib/actions';



const SideNav = () => {
  const [SideNav, setSideNav] = useState<SideNavItem[]>();

  useEffect(() => {
    const fetchData = async () => {
      const cookie = document.cookie;
      const userInformation = cookie
        .split(";")
        .find((c) => c.trim().startsWith("user="));


      if (userInformation) {
        const userValue = userInformation.split("=")[1];
        //console.log("menu item user load: ", JSON.parse(decodeURIComponent(userValue)))
        const temp_user = JSON.parse(decodeURIComponent(userValue))
        if (temp_user?.role) {
          setSideNav(await get_side_nav(temp_user.role));
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col w-full h-full"> {/* Asegurarse que use h-full */}
        {/* Logo y otros elementos */}
        <div className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-20 w-full bg-[#BD181E]">
          <SocialHubLogo height={100} width={300} />
        </div>

        {/* Elementos del menú */}
        <div className="flex flex-col space-y-2 md:px-6 flex-grow mt-8 text-[#515E5F]"> {/* flex-grow permite que los elementos crezcan */}
          {SideNav?.slice(0, -1).map((item, idx) => { // Renderiza todos los elementos excepto "Cuentas"
            return <MenuItem key={idx} item={item} />;
          })}
        </div>

        {/* Cuentas al fondo */}
        <div className="mt-auto md:px-6 mb-4 text-[#515E5F]"> {/* mt-auto empuja este div hacia el fondo */}
          {SideNav && <MenuItem item={SideNav[SideNav.length - 1]} />} {/* Cuentas */}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover:bg-[#BD181E] hover:text-white w-full justify-between ${
              pathname.includes(item.path) ? 'bg-[#BD181E] text-white' : ''
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <ChevronDownIcon className="w-6" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`${
                    subItem.path === pathname ? 'font-bold text-[#BD181E]' : ''
                  } hover:text-[#BD181E]`} // 
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-[#BD181E] hover:text-white ${
            item.path === pathname ? 'bg-[#BD181E] text-white' : ''
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};

