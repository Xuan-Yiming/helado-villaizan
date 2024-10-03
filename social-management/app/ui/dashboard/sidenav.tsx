import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import SocialHubLogo from '../social-hub-logo';
import Logo from '../logo';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import {ArrowRightIcon} from '@heroicons/react/24/solid';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-[#BD181E]">
        <Link
        className="mb-2 flex h-10 items-end justify-start bg-[#BD181E] p-4 md:h-20"
        href="/dashboard"
        >
            <div className="w-50 text-black md:w-50">
                <SocialHubLogo/>
            </div>
        </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0">
            <NavLinks showText={true} />
            <div className="hidden h-auto w-full grow bg-[#BD181E] md:block"></div>
            <form>
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 bg-[#BD181E] p-3 text-sm font-medium hover:bg-[#515E5F] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
                <UserCircleIcon className="w-6" />
                <div className="hidden md:block">Cuentas y Configuracion</div>
                <ArrowRightIcon className="w-6" />
            </button>
        </form>
        </div>
    </div>
  );
}

