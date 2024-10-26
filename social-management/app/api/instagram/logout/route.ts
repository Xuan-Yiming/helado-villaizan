import { NextResponse } from 'next/server';
import { logout_social_account } from '@/app/lib/database';

export async function GET() {
    try {
        // Espera a que ambas operaciones se completen en paralelo.
        await Promise.all([
            logout_social_account('facebook'),
            logout_social_account('instagram')
        ]);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
    
    // Redirige solo después de que ambas promesas se resuelvan.
    return;
}
