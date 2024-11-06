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
        const postsResponse = await fetch(`https://graph.facebook.com/v20.0/${instagramBusinessAccount}/media?fields=id,caption,media_url,timestamp,comments_count&access_token=${accessToken}`, { cache: "no-store" });
        const postsData = await postsResponse.json();

        if (!postsResponse.ok || !postsData.data) {
            throw new Error(`Error al obtener publicaciones de Instagram: ${postsData.error ? postsData.error.message : 'No se encontraron datos'}`);
        }

        // Filtrar publicaciones que tienen al menos un comentario
        const filteredPosts = postsData.data
            .filter((post: any) => post.comments_count > 0)
            .map((post: any) => ({
                postId: post.id,
                socialNetwork: 'instagram',
                caption: post.caption || "",
                commentsCount: post.comments_count,
                publishDate: post.timestamp,
                thumbnail: post.media_url || ""
            }));

        return NextResponse.json(filteredPosts, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Publicaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener publicaciones de Instagram' }, { status: 500 });
    }
}
