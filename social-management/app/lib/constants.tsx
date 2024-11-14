import {
  UserGroupIcon,
  InboxArrowDownIcon,
  PaperAirplaneIcon,
  PresentationChartLineIcon,
  Cog8ToothIcon,
  UserIcon
} from '@heroicons/react/24/solid';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Posts',
    path: '/pages/publicaciones',
    icon: <PaperAirplaneIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Publicaciones', path: '/pages/publicaciones' },
      { title: 'Crear', path: '/pages/publicaciones/crear' },
      { title: 'Calendario', path: '/pages/publicaciones/calendario' },
      { title: 'Campañas', path: '/pages/publicaciones/campanas' },
    ],
  },
  {
    title: 'Interacciones',
    path: '/pages/interacciones',
    icon: <InboxArrowDownIcon className='w-6' />,
  },
  {
    title: 'Clientes',
    path: '/pages/preferencias-de-clientes',
    icon: <UserGroupIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Datos', path: '/pages/preferencias-de-clientes/datos' },
      { title: 'Encuestas', path: '/pages/preferencias-de-clientes/encuestas' },
    ],
  },
  {
    title: 'Análisis',
    path: '/pages/analisis-reporte',
    icon: <PresentationChartLineIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Principal', path: '/pages/analisis-reporte' },
      { title: 'Redes', path: '/pages/analisis-reporte/redes' },
      { title: 'Ventas', path: '/pages/analisis-reporte/ventas' },
    ],
  },
  {
    title: 'Cuentas',
    path: '/pages/cuentas/redes',
    icon: <UserIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Redes', path: '/pages/cuentas/redes' },
      { title: 'Empleados', path: '/pages/cuentas/empleados' },
    ],
  },
  {
    title: 'Configuración',
    path: '/pages/cuentas-configuraciones',
    icon: <Cog8ToothIcon className='w-6' />,
  },
];

export const SIDENAV_ITEMS_SURVY: SideNavItem[] = [
  {
    title: 'Clientes',
    path: '/pages/preferencias-de-clientes',
    icon: <UserGroupIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Encuestas', path: '/pages/preferencias-de-clientes/encuestas' },
    ],
  },
  {
    title: 'Configuración',
    path: '/pages/cuentas-configuraciones',
    icon: <Cog8ToothIcon className='w-6' />,
  },
];

export const SIDENAV_ITEMS_USER: SideNavItem[] = [
  {
    title: 'Posts',
    path: '/pages/publicaciones',
    icon: <PaperAirplaneIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Publicaciones', path: '/pages/publicaciones' },
      { title: 'Crear', path: '/pages/publicaciones/crear' },
      { title: 'Calendario', path: '/pages/publicaciones/calendario' },
      { title: 'Campañas', path: '/pages/publicaciones/campanas' },
    ],
  },
  {
    title: 'Interacciones',
    path: '/pages/interacciones',
    icon: <InboxArrowDownIcon className='w-6' />,
  },
  {
    title: 'Configuración',
    path: '/pages/cuentas-configuraciones',
    icon: <Cog8ToothIcon className='w-6' />,
  },
];

export const SIDENAV_ITEMS_MOD: SideNavItem[] = [
  {
    title: 'Posts',
    path: '/pages/publicaciones',
    icon: <PaperAirplaneIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Publicaciones', path: '/pages/publicaciones' },
      { title: 'Crear', path: '/pages/publicaciones/crear' },
      { title: 'Calendario', path: '/pages/publicaciones/calendario' },
      { title: 'Campañas', path: '/pages/publicaciones/campanas' },
    ],
  },
  {
    title: 'Interacciones',
    path: '/pages/interacciones',
    icon: <InboxArrowDownIcon className='w-6' />,
  },
  {
    title: 'Clientes',
    path: '/pages/preferencias-de-clientes',
    icon: <UserGroupIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Datos', path: '/pages/preferencias-de-clientes/datos' },
      { title: 'Encuestas', path: '/pages/preferencias-de-clientes/encuestas' },
    ],
  },
  {
    title: 'Análisis',
    path: '/pages/analisis-reporte',
    icon: <PresentationChartLineIcon className='w-6' />,
    submenu: true,
    subMenuItems: [
      { title: 'Principal', path: '/pages/analisis-reporte' },
      { title: 'Redes', path: '/pages/analisis-reporte/redes' },
      { title: 'Ventas', path: '/pages/analisis-reporte/ventas' },
    ],
  },
  {
    title: 'Configuración',
    path: '/pages/cuentas-configuraciones',
    icon: <Cog8ToothIcon className='w-6' />,
  },
];


export const ROLE_ALLOWED_PATHS: { [key: string]: string[] } = {
  user: [
    '/pages',
    '/pages/publicaciones',
    '/pages/publicaciones/crear',
    '/pages/publicaciones/calendario',
    '/pages/publicaciones/campanas',
    '/pages/interacciones',
    '/pages/cuentas-configuraciones',
  ],
  moderator: [
    '/pages',
    '/pages/publicaciones',
    '/pages/publicaciones/crear',
    '/pages/publicaciones/calendario',
    '/pages/publicaciones/campanas',
    '/pages/interacciones',
    '/pages/preferencias-de-clientes',
    '/pages/preferencias-de-clientes/datos',
    '/pages/preferencias-de-clientes/encuestas',
    '/pages/analisis-reporte',
    '/pages/analisis-reporte/engagement',
    '/pages/analisis-reporte/seguidores',
    '/pages/analisis-reporte/ventas',
    '/pages/cuentas-configuraciones',
  ],
  survy_creator: [
    '/pages',
    '/pages/preferencias-de-clientes',
    '/pages/preferencias-de-clientes/encuestas',
    '/pages/preferencias-de-clientes/encuestas/crear',
    '/pages/preferencias-de-clientes/encuestas/resultado',
    '/pages/cuentas-configuraciones',
  ],
};

/*
Publicaciones
    Todas
    Crear
    Calendario
    Campañas

Interacciones

Preferencias de Clientes
    Datos
        insights
    Encuestas
        crear
        resultado

Analisis y Reportes
    Principal
    Redes
    Ventas

Cuentas y Configuraciones
*/