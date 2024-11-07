// instagram/publicaciones/route.ts
'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET() {
    try {
        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error('No se encontraron datos de la cuenta de Instagram en la base de datos');
        }

        const { token_autenticacion: accessToken, instagram_business_account: instagramBusinessAccount } = account;

        // Obtener las publicaciones del negocio en Instagram
        const postsResponse = await fetch(`https://graph.facebook.com/v20.0/${instagramBusinessAccount}/media?fields=id,caption,media_url,timestamp&access_token=${accessToken}`, { cache: "no-store" });
        const postsData = await postsResponse.json();

        if (!postsResponse.ok || !postsData.data) {
            throw new Error(`Error al obtener publicaciones de Instagram: ${postsData.error ? postsData.error.message : 'No se encontraron datos'}`);
        }

        // Filtrar publicaciones y obtener solo los comentarios principales para cada una
        const filteredPosts = await Promise.all(
            postsData.data.map(async (post: any) => {
                // Obtener todos los comentarios de la publicación
                const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?fields=id,parent_id&access_token=${accessToken}`, { cache: "no-store" });
                const commentsData = await commentsResponse.json();

                if (!commentsResponse.ok || !commentsData.data) {
                    console.error(`Error al obtener comentarios para la publicación ${post.id}:`, commentsData.error);
                    return null;
                }

                // Filtrar solo los comentarios principales (sin parent_id)
                const mainCommentsCount = commentsData.data.filter((comment: any) => !comment.parent_id).length;

                return {
                    postId: post.id,
                    socialNetwork: 'instagram',
                    caption: post.caption || "",
                    commentsCount: mainCommentsCount, // Solo cuenta los comentarios principales
                    publishDate: post.timestamp,
                    thumbnail: post.media_url || ""
                };
            })
        );

        // Filtrar y devolver solo las publicaciones que tienen al menos un comentario principal
        const postsWithComments = filteredPosts.filter(post => post && post.commentsCount > 0);

        return NextResponse.json(postsWithComments, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Publicaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener publicaciones de Instagram' }, { status: 500 });
    }
}
