'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET() {
    try {
        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error('No se encontraron datos de la cuenta de Instagram en la base de datos');
        }

        const { token_autenticacion: accessToken, instagram_business_account: igUserId } = account;

        const response = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/conversations?access_token=${accessToken}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error al obtener mensajes de Instagram: ${data.error.message}`);
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Messages API:', error);
        return NextResponse.json({ error: 'Error al obtener mensajes de Instagram' }, { status: 500 });
    }
}
