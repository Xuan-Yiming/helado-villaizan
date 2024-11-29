'use server';
import { NextResponse } from 'next/server';
import { get_social_account, isCommentResponded } from "@/app/lib/database";
import { isCriticalComment } from "@/app/lib/meta"; // Importa la función de Hugging Face
import { MetaComment } from "@/app/lib/types"; // Importa el tipo MetaComment

export async function POST(request: Request) {
    try {
        const { postId } = await request.json();
        
        if (!postId) {
            throw new Error('No se proporcionó un postId');
        }

        // Obtener la cuenta de Facebook
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Llamada a la API de Facebook para obtener los comentarios
        const commentsResponse = await fetch(
            `https://graph.facebook.com/v20.0/${postId}/comments?access_token=${accessToken}`, 
            { cache: "no-store" }
        );
        const commentsData = await commentsResponse.json();

        if (!commentsResponse.ok || !commentsData.data) {
            throw new Error(
                `Error al obtener comentarios de Facebook: ${
                    commentsData.error ? commentsData.error.message : 'No se encontraron datos'
                }`
            );
        }

        // Procesar y formatear los comentarios
        const formattedComments: MetaComment[] = await Promise.all(
            commentsData.data.map(async (comment: any) => {
                const isResponded = await isCommentResponded(comment.id); // Verifica si está respondido
                const isCritical = await isCriticalComment(comment.message); // Analiza si es crítico

                // Manejar casos donde 'from' o 'from.name' sean indefinidos
                const userName = comment.from?.name || "Usuario anónimo";

                //console.log(comment.message);
                //console.log("Es critico? " + isCritical);

                return {
                    id: comment.id,
                    userName: userName, // Usar el nombre o un valor por defecto
                    text: comment.message,
                    timestamp: comment.created_time,
                    respondido: isResponded,
                    crítico: isCritical, // Indica si es crítico
                };
            })
        );

        // Ordenar los comentarios por fecha de creación (timestamp)
        formattedComments.sort((a: MetaComment, b: MetaComment) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        // Devolver los comentarios formateados como respuesta
        return NextResponse.json(formattedComments, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Comentarios API:', error);
        return NextResponse.json({ error: 'Error al obtener comentarios de Facebook' }, { status: 500 });
    }
}
