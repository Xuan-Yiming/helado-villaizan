import { NextResponse } from 'next/server';

import { logout_social_account } from '@/app/lib/database';

export async function GET() {
    try {
        console.log('Cerrando sesión en Facebook...');
        await logout_social_account('facebook');
        console.log('Cerrando sesión en Instagram...');
        await logout_social_account('instagram');
    } catch (error) {
        console.error('Error en el logout:', error);
    }

    console.log('Redirigiendo en 3 segundos...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.redirect('https://helado-villaizan.vercel.app/pages/cuentas-configuraciones');
}
