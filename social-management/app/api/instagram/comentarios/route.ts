'use server';
import { NextResponse } from 'next/server';
import { get_social_account, isCommentResponded } from "@/app/lib/database";
import { isCriticalComment } from "@/app/lib/meta"; // Importa la función de Hugging Face
import { MetaComment } from "@/app/lib/types"; // Importa MetaComment

export async function POST(request: Request) {
    try {
        const { postId } = await request.json();
        
        if (!postId) {
            throw new Error('No se proporcionó un postId');
        }

        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontraron datos de la cuenta de Instagram en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Obtener comentarios de la publicación especificada
        const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${postId}/comments?fields=from,timestamp,text&access_token=${accessToken}`, { cache: "no-store" });
        const commentsData = await commentsResponse.json();

        if (!commentsResponse.ok || !commentsData.data) {
            throw new Error(`Error al obtener comentarios de Instagram: ${commentsData.error ? commentsData.error.message : 'No se encontraron datos'}`);
        }

        // Formatear comentarios y agregar estado de "respondido"
        const formattedComments: MetaComment[] = await Promise.all(
            commentsData.data.map(async (comment: any) => {
                const isResponded = await isCommentResponded(comment.id); // Verifica si el comentario está respondido
                const isCritical = await isCriticalComment(comment.message); // Analiza si es crítico

                // Manejar casos donde 'from' o 'from.name' sean indefinidos
                const userName = comment.from?.name || "Usuario anónimo";

                //console.log(comment.message);
                //console.log("Es critico? " + isCritical);
                return {
                    id: comment.id,
                    userName: comment.from?.username || "Usuario desconocido",
                    text: comment.message || comment.text || "", // Asegurarse de obtener el texto
                    timestamp: comment.created_time || comment.timestamp, // Verificar cuál es el correcto
                    respondido: isResponded, // Agrega el estado de respondido al comentario
                    crítico: isCritical, // Indica si es crítico
                };
            })
        );

        // Ordenar comentarios por timestamp
        formattedComments.sort((a: MetaComment, b: MetaComment) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return NextResponse.json(formattedComments, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Comentarios API:', error);
        return NextResponse.json({ error: 'Error al obtener comentarios de Instagram' }, { status: 500 });
    }
}
