"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import SocialHubLogo from "../icons/social-hub-logo";
import useScroll from "@/app/hooks/use-scroll";
import { UserAccount } from "@/app/lib/types";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import axios from "axios";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [user, setUser] = useState<UserAccount>();
  const router = useRouter();

  useEffect(() => {
    const cookie = document.cookie;
    const userInformation = cookie
      .split(";")
      .find((c) => c.trim().startsWith("user="));

    if (userInformation) {
      const userValue = userInformation.split("=")[1];
      setUser(JSON.parse(decodeURIComponent(userValue)));
    }
  }, []);

  const handleLogout = async () => {
    await axios.get("/api/auth/logout");
    router.push("/login");
  };

  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 ${
        scrolled
          ? "border-b border-gray-200 bg-[#BD181E]/75 backdrop-blur-lg"
          : ""
      } ${selectedLayout ? "border-b border-gray-200 bg-[#BD181E]" : ""}`}
    >
      <div className="flex h-[79px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-row space-x-3 items-center justify-center md:hidden">
            <Link href="/pages" >
            <SocialHubLogo height={100} width={200} />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex text-white font-bold justify-center items-center">
          <Link href="/pages/cuentas-configuraciones"
          className="flex text-white font-bold justify-center items-center"
          >
          
          <div >
            {user && (
              <div className="mr-4">
                {user.nombre} {user.apellido}
              </div>
            )}
          </div>

          <div>
            {user?.photo && (
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 mr-4">
                <Image
                  src={user.photo}
                  alt="User Photo"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  loader={({ src }) => src}
                />
              </div>
            )}
          </div>
          </Link>
          <div className="">
            <button
              className="flex text-white px-4 py-2 rounded-mdfont-bold"
              onClick={handleLogout}
              title="Logout"
            >
              <ArrowRightEndOnRectangleIcon className="h-10 w-10 mr-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
