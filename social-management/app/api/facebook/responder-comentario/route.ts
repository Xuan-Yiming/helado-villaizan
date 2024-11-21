// facebook/responder-comentario.ts
'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function POST(request: Request) {
    const { commentId, message } = await request.json();
    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion || !account.page_id) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Realiza la respuesta al comentario
        const response = await fetch(`https://graph.facebook.com/v20.0/${commentId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                access_token: accessToken
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error al responder comentario: ${data.error.message}`);
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error('Error al responder al comentario:', error);
        return NextResponse.json({ error: 'Error al responder al comentario' }, { status: 500 });
    }
}
