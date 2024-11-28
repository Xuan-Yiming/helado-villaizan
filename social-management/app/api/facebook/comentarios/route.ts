'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";
import { isCommentResponded } from "@/app/lib/database"; // Importa la función para verificar comentarios respondidos
import { MetaComment } from "@/app/lib/types"; // Importa MetaComment

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

        // Formatear comentarios y agregar estado de "respondido"
        const formattedComments: MetaComment[] = await Promise.all(
            commentsData.data.map(async (comment: any) => {
                const isResponded = await isCommentResponded(comment.id); // Verifica si el comentario está respondido
                return {
                    id: comment.id,
                    userName: comment.from.name,
                    text: comment.message,
                    timestamp: comment.created_time,
                    respondido: isResponded // Agrega el estado de respondido al comentario
                };
            })
        );

        // Ordenar comentarios por timestamp
        formattedComments.sort((a: MetaComment, b: MetaComment) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return NextResponse.json(formattedComments, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Comentarios API:', error);
        return NextResponse.json({ error: 'Error al obtener comentarios de Facebook' }, { status: 500 });
    }
}
