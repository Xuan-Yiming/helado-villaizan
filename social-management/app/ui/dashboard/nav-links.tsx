import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,

    RectangleGroupIcon,
    InboxArrowDownIcon,
    PaperAirplaneIcon,
    PresentationChartLineIcon,
    ChartBarIcon
  } from '@heroicons/react/24/solid';
  import Link from 'next/link';
  
  // Map of links to display in the side navigation.
  // Depending on the size of the application, this would be stored in a database.
  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: RectangleGroupIcon },
    { name: 'Mensajes', href: '/mensajes', icon: InboxArrowDownIcon },
    { name: 'Publicar', href: '/publicar', icon: PaperAirplaneIcon },
    { name: 'Analisis', href: '/analisis', icon: PresentationChartLineIcon },
    { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  ];
  
export default function NavLinks({ showText }: { showText: boolean }) {
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link 
                        key={link.name}
                        href={link.href}
                        className="
                        flex h-[48px] grow items-center justify-center gap-2 bg-[#BD181E] p-3 text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-3
                        hover:bg-[#515E5F] hover:text-white-600"
                    >
                        <LinkIcon className="w-6" />
                        {showText && <p className="hidden md:block">{link.name}</p>}
                    </Link>
                );
            })}
        </>
    );
}
  