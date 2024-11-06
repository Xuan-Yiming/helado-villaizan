// comentarios/route.ts
'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function POST(request: Request) {
    try {
        const { postId } = await request.json();
        
        if (!postId) {
            throw new Error('No se proporcionó un postId');
        }

        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Obtener comentarios de la publicación especificada
        const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${postId}/comments?access_token=${accessToken}`, { cache: "no-store" });
        const commentsData = await commentsResponse.json();

        if (!commentsResponse.ok || !commentsData.data) {
            throw new Error(`Error al obtener comentarios de Facebook: ${commentsData.error ? commentsData.error.message : 'No se encontraron datos'}`);
        }

        const formattedComments = commentsData.data.map((comment: any) => ({
            id: comment.id,
            userName: comment.from.name,
            text: comment.message,
            timestamp: comment.created_time
        }));

        return NextResponse.json(formattedComments, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Comentarios API:', error);
        return NextResponse.json({ error: 'Error al obtener comentarios de Facebook' }, { status: 500 });
    }
}
