// instagram/publicaciones/route.ts
'use server';
import { NextResponse, NextRequest } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error('No se encontraron datos de la cuenta de Instagram en la base de datos');
        }

        const { token_autenticacion: accessToken, instagram_business_account: instagramBusinessAccount } = account;

        // Obtener el parámetro `includeCommentsOnly` de la URL
        const includeCommentsOnly = request.nextUrl.searchParams.get("includeCommentsOnly") === "true";

        // Obtener las publicaciones del negocio en Instagram
        const postsResponse = await fetch(`https://graph.facebook.com/v20.0/${instagramBusinessAccount}/media?fields=id,caption,media_url,timestamp&access_token=${accessToken}`, { cache: "no-store" });
        const postsData = await postsResponse.json();

        if (!postsResponse.ok || !postsData.data) {
            throw new Error(`Error al obtener publicaciones de Instagram: ${postsData.error ? postsData.error.message : 'No se encontraron datos'}`);
        }

        // Iterar sobre las publicaciones para obtener el conteo de comentarios solo si `includeCommentsOnly` es true
        const postsWithComments = await Promise.all(
            postsData.data.map(async (post: any) => {
                if (includeCommentsOnly) {
                    const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?fields=id,parent_id&access_token=${accessToken}`, { cache: "no-store" });
                    const commentsData = await commentsResponse.json();

                    // Solo incluir publicaciones con al menos un comentario principal
                    const mainCommentsCount = commentsData.data ? commentsData.data.filter((comment: any) => !comment.parent_id).length : 0;
                    if (mainCommentsCount > 0) {
                        return {
                            postId: post.id,
                            socialNetwork: 'instagram',
                            caption: post.caption || "",
                            commentsCount: mainCommentsCount,
                            publishDate: post.timestamp,
                            thumbnail: post.media_url || ""
                        };
                    }
                    return null; // Ignorar las publicaciones sin comentarios principales
                } else {
                    // Si no se requiere filtrar por comentarios, incluir todas las publicaciones
                    return {
                        postId: post.id,
                        socialNetwork: 'instagram',
                        caption: post.caption || "",
                        commentsCount: undefined, // No calculamos el conteo de comentarios
                        publishDate: post.timestamp,
                        thumbnail: post.media_url || ""
                    };
                }
            })
        );

        // Si `includeCommentsOnly` es true, filtramos para remover entradas `null` y solo regresar publicaciones con comentarios
        const filteredPosts = includeCommentsOnly ? postsWithComments.filter(post => post !== null) : postsWithComments;

        return NextResponse.json(filteredPosts, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Publicaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener publicaciones de Instagram' }, { status: 500 });
    }
}
