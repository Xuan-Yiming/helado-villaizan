'use server';
import { Post } from "@/app/lib/types";
import { get_social_account } from "@/app/lib/database";

export async function POST(req: Request) {
  try {
    const post: Post = await req.json(); // Parseamos el cuerpo del request

    console.log("Datos recibidos para Facebook:", post);

    // Obtener la cuenta vinculada desde la base de datos
    const account = await get_social_account('facebook');
    if (!account || !account.token_autenticacion || !account.page_id) {
      throw new Error('Faltan datos de la cuenta de Facebook');
    }

    const { token_autenticacion: accessToken, page_id: pageId } = account;

    let mediaIds: string[] = [];

    // Subir cada imagen/vídeo si hay medios asociados
    if (post.media && post.media.length > 0) {
      for (const mediaUrl of post.media) {
        const mediaResponse = await fetch(
          `https://graph.facebook.com/v20.0/${pageId}/photos`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: mediaUrl,
              published: false, // No se publica inmediatamente
              access_token: accessToken,
            }),
          }
        );

        const mediaData = await mediaResponse.json();

        if (!mediaData.id) {
          console.error('Error al subir media:', mediaData);
          throw new Error('Error al subir media a Facebook');
        }

        mediaIds.push(mediaData.id); // Guardar los IDs de los medios subidos
      }
    }

    // Crear la publicación en Facebook
    const postResponse = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: post.content,
          access_token: accessToken,
          attached_media: mediaIds.map((id) => ({ media_fbid: id })),
        }),
      }
    );

    const postData = await postResponse.json();

    if (!postData.id) {
      console.error('Error al publicar en Facebook:', postData);
      throw new Error('Error al publicar en Facebook');
    }

    console.log(`Publicación realizada con éxito. ID: ${postData.id}`);

    return new Response(JSON.stringify({ success: true, postId: postData.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return new Response(JSON.stringify({ error: 'Error al publicar en Facebook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
