import { NextResponse } from 'next/server';

import { logout_social_account } from '@/app/lib/data';

export async function GET() {
    try {
        await logout_social_account('facebook');
    } catch (error) {
    }
    return NextResponse.redirect('https://helado-villaizan.vercel.app/pages/cuentas-configuraciones');
}