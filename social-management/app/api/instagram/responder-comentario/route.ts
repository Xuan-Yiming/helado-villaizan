'use server';
import { NextResponse } from 'next/server';
import { get_social_account, addRespondedComment, isCommentResponded } from "@/app/lib/database";

export async function POST(request: Request) {
    const { commentId, message } = await request.json();
    try {
        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontraron datos de la cuenta de Instagram en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Realiza la respuesta al comentario
        const response = await fetch(`https://graph.facebook.com/v20.0/${commentId}/replies`, {
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

        // Verificar si el comentario ya está marcado como respondido
        const alreadyResponded = await isCommentResponded(commentId);

        if (!alreadyResponded) {
            // Marcar comentario como respondido en la base de datos si aún no lo está
            await addRespondedComment(commentId);
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error('Error al responder al comentario de Instagram:', error);
        return NextResponse.json({ error: 'Error al responder al comentario de Instagram' }, { status: 500 });
    }
}
