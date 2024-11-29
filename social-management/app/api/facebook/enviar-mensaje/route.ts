// facebook/enviar-mensaje.ts
'use server';

import { NextResponse, NextRequest } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function POST(request: NextRequest) {
    const { recipientId, message } = await request.json();

    if (!recipientId || !message) {
        return NextResponse.json({ error: 'Faltan parámetros: recipientId o message' }, { status: 400 });
    }

    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontraron datos de autenticación de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Enviar el mensaje
        const response = await fetch(`https://graph.facebook.com/v20.0/me/messages?access_token=${accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text: message },
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`Error al enviar el mensaje: ${responseData.error ? responseData.error.message : 'Error desconocido'}`);
        }

        return NextResponse.json({ success: true, data: responseData }, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Enviar Mensaje API:', error);
        return NextResponse.json({ error: 'Mensaje enviado fuera del período permitido por Meta.' }, { status: 500 });
    }
}
