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
    title: 'Mensajes',
    path: '/pages/mensajes',
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
      { title: 'Engagement', path: '/pages/analisis-reporte/engagement' },
      { title: 'Seguidores', path: '/pages/analisis-reporte/seguidores' },
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
    title: 'Mensajes',
    path: '/pages/mensajes',
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
    title: 'Mensajes',
    path: '/pages/mensajes',
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
      { title: 'Engagement', path: '/pages/analisis-reporte/engagement' },
      { title: 'Seguidores', path: '/pages/analisis-reporte/seguidores' },
      { title: 'Ventas', path: '/pages/analisis-reporte/ventas' },
    ],
  },
  {
    title: 'Configuración',
    path: '/pages/cuentas-configuraciones',
    icon: <Cog8ToothIcon className='w-6' />,
  },
];

/*
Publicaciones
    Todas
    Crear
    Calendario
    Campañas

Mensajes

Preferencias de Clientes
    Datos
        insights
    Encuestas
        crear
        resultado

Analisis y Reportes
    Principal
    Engagement
    Seguidores
    Ventas

Cuentas y Configuraciones
*/