'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET() {
    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion || !account.page_id) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken, page_id: pageId } = account;

        // Paso 1: Obtener las publicaciones de la página de Facebook sin caché
        const postsResponse = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed?access_token=${accessToken}`, { cache: "no-store" });
        const postsData = await postsResponse.json();
        
        console.log("Datos de publicaciones:", postsData);  // Log para ver las publicaciones obtenidas

        if (!postsResponse.ok || !postsData.data) {
            throw new Error(`Error al obtener publicaciones de Facebook: ${postsData.error ? postsData.error.message : 'No se encontraron datos'}`);
        }

        // Define el tipo para una publicación
        type FacebookPost = {
            id: string;
            message?: string;
            created_time: string;
            full_picture?: string;
        };

        // Define el tipo para un comentario
        type FacebookComment = {
            id: string;
            from: { name: string };
            message: string;
            created_time: string;
        };

        // Paso 2: Obtener los comentarios para cada publicación
        const commentsData = await Promise.all(postsData.data.map(async (post: FacebookPost) => {
            try {
                const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?access_token=${accessToken}`, { cache: "no-store" });
                const comments = await commentsResponse.json();

                console.log(`Comentarios para la publicación ${post.id}:`, comments); // Log para ver los comentarios de cada publicación

                return {
                    postId: post.id,
                    caption: post.message || "", // Maneja el caso donde `message` podría estar indefinido
                    commentsCount: comments.data ? comments.data.length : 0,
                    publishDate: post.created_time,
                    thumbnail: post.full_picture,
                    comments: comments.data ? comments.data.map((comment: FacebookComment) => ({
                        id: comment.id,
                        userName: comment.from.name,
                        text: comment.message,
                        timestamp: comment.created_time
                    })) : []
                };
            } catch (commentError) {
                console.error(`Error al obtener comentarios para la publicación ${post.id}:`, commentError);
                return {
                    postId: post.id,
                    caption: post.message || "",
                    commentsCount: 0,
                    publishDate: post.created_time,
                    thumbnail: post.full_picture,
                    comments: []
                };
            }
        }));

        console.log("Datos finales enviados al front-end:", commentsData);  // Log para ver el resultado final antes de enviar al cliente

        return NextResponse.json(commentsData, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Comments API:', error);
        return NextResponse.json({ error: 'Error al obtener comentarios y publicaciones de Facebook' }, { status: 500 });
    }
}
