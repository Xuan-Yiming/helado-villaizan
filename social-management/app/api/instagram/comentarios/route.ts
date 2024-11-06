'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET() {
    try {
        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error('No se encontraron datos de la cuenta de Instagram en la base de datos');
        }

        const { token_autenticacion: accessToken, instagram_business_account: igBusinessId } = account;

        // Paso 1: Obtener las publicaciones de la cuenta de Instagram
        const mediaResponse = await fetch(`https://graph.facebook.com/v20.0/${igBusinessId}/media?fields=id,caption&access_token=${accessToken}`);
        const mediaData = await mediaResponse.json();

        if (!mediaResponse.ok) {
            throw new Error(`Error al obtener publicaciones de Instagram: ${mediaData.error.message}`);
        }

        // Paso 2: Obtener comentarios de cada publicación
        const commentsData = await Promise.all(mediaData.data.map(async (media: any) => {
            const commentsResponse = await fetch(`https://graph.facebook.com/v20.0/${media.id}/comments?access_token=${accessToken}`);
            const comments = await commentsResponse.json();
            return { mediaId: media.id, caption: media.caption, comments: comments.data || [] };
        }));

        return NextResponse.json(commentsData, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Comments API:', error);
        return NextResponse.json({ error: 'Error al obtener comentarios y publicaciones de Instagram' }, { status: 500 });
    }
}
