"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import SocialHubLogo from "../icons/social-hub-logo";
import useScroll from "@/app/hooks/use-scroll";
import { UserAccount } from "@/app/lib/types";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [user, setUser] = useState<UserAccount>();

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
            <SocialHubLogo height={100} width={200} />
          </div>
        </div>

        <div className="hidden md:flex text-white font-bold justify-center items-center">
          <div>
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
        </div>
      </div>
    </div>
  );
};

export default Header;
