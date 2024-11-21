// publicaciones/route.ts
'use server';
import { NextResponse, NextRequest } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion || !account.page_id) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken, page_id: pageId } = account;
        
        // Obtiene el parámetro `includeCommentsOnly` de la URL
        const includeCommentsOnly = request.nextUrl.searchParams.get("includeCommentsOnly") === "true";

        // Obtener las publicaciones de la página de Facebook
        const postsResponse = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed?fields=id,message,created_time,full_picture&access_token=${accessToken}`, { cache: "no-store" });
        const postsData = await postsResponse.json();

        if (!postsResponse.ok || !postsData.data) {
            throw new Error(`Error al obtener publicaciones de Facebook: ${postsData.error ? postsData.error.message : 'No se encontraron datos'}`);
        }

        // Iterar sobre las publicaciones para obtener el conteo de comentarios solo si `includeCommentsOnly` es true
        const postsWithComments = await Promise.all(
            postsData.data.map(async (post: any) => {
                if (includeCommentsOnly) {
                    const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?summary=true&access_token=${accessToken}`, { cache: "no-store" });
                    const commentsData = await commentsResponse.json();

                    // Solo incluir publicaciones con al menos un comentario
                    if (commentsData.summary && commentsData.summary.total_count > 0) {
                        return {
                            postId: post.id,
                            socialNetwork: 'facebook',
                            caption: post.message || "",
                            commentsCount: commentsData.summary.total_count, // Usamos el conteo de comentarios real
                            publishDate: post.created_time,
                            thumbnail: post.full_picture || ""
                        };
                    }
                    return null; // Ignoramos las publicaciones sin comentarios
                } else {
                    // Si no se requiere filtrar por comentarios, incluimos todas las publicaciones
                    return {
                        postId: post.id,
                        socialNetwork: 'facebook',
                        caption: post.message || "",
                        commentsCount: undefined, // No calculamos el conteo de comentarios
                        publishDate: post.created_time,
                        thumbnail: post.full_picture || ""
                    };
                }
            })
        );

        // Si `includeCommentsOnly` es true, filtramos para remover entradas `null` y solo regresar publicaciones con comentarios
        const filteredPosts = includeCommentsOnly ? postsWithComments.filter(post => post !== null) : postsWithComments;

        return NextResponse.json(filteredPosts, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Publicaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener publicaciones de Facebook' }, { status: 500 });
    }
}
