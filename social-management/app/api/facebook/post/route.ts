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

    // Preparar tiempo de publicación programada si es necesario
    const scheduledPublishTime = 
      post.status === 'programado' && post.post_time 
        ? Math.floor(new Date(post.post_time).getTime() / 1000) // Convertir a timestamp UNIX
        : null;

    // Manejo de Videos
    if (post.type === 'video' && post.media && post.media.length > 0) {
      const videoUrl = post.media[0]; // Asumimos que hay un solo video
      console.log("Subiendo video:", videoUrl);

      const formData = new FormData();
      formData.append('file_url', videoUrl);
      formData.append('access_token', accessToken);
      if (post.content) {
        formData.append('description', post.content);
      }
      if (scheduledPublishTime) {
        formData.append('scheduled_publish_time', scheduledPublishTime.toString());
        formData.append('published', 'false'); // Marcar como no publicado hasta la hora programada
      }

      const videoResponse = await fetch(
        `https://graph-video.facebook.com/v20.0/${pageId}/videos`,
        { method: 'POST', body: formData }
      );

      const videoData = await videoResponse.json();

      if (!videoData.id) {
        console.error('Error al subir video:', videoData);
        throw new Error('Error al subir video a Facebook');
      }

      console.log(`Video subido con éxito. ID: ${videoData.id}`);
      return new Response(
        JSON.stringify({ success: true, postId: videoData.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Manejo de Imágenes
    if (post.media && post.media.length > 0) {
      for (const mediaUrl of post.media) {
        console.log("Subiendo imagen:", mediaUrl);

        const formData = new FormData();
        formData.append('url', mediaUrl);
        formData.append('published', 'false');
        formData.append('access_token', accessToken);

        const mediaResponse = await fetch(
          `https://graph.facebook.com/v20.0/${pageId}/photos`,
          { method: 'POST', body: formData }
        );

        const mediaData = await mediaResponse.json();

        if (!mediaData.id) {
          console.error('Error al subir imagen:', mediaData);
          throw new Error('Error al subir imagen a Facebook');
        }

        mediaIds.push(mediaData.id); // Guardar los IDs de las imágenes subidas
      }

      console.log(`Imágenes subidas con éxito. IDs: ${mediaIds}`);

      const postBody: any = {
        message: post.content,
        access_token: accessToken,
        attached_media: mediaIds.map((id) => ({ media_fbid: id })),
      };

      if (scheduledPublishTime) {
        postBody.scheduled_publish_time = scheduledPublishTime;
        postBody.published = false;
      }

      const postResponse = await fetch(
        `https://graph.facebook.com/v20.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postBody),
        }
      );

      const postData = await postResponse.json();

      if (!postData.id) {
        console.error('Error al publicar en Facebook:', postData);
        throw new Error('Error al publicar en Facebook');
      }

      console.log(`Publicación realizada con éxito. ID: ${postData.id}`);

      return new Response(
        JSON.stringify({ success: true, postId: postData.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Publicación de solo texto
    const textPostBody: any = {
      message: post.content,
      access_token: accessToken,
    };

    if (scheduledPublishTime) {
      textPostBody.scheduled_publish_time = scheduledPublishTime;
      textPostBody.published = false;
    }

    const textPostResponse = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textPostBody),
      }
    );

    const textPostData = await textPostResponse.json();

    if (!textPostData.id) {
      console.error('Error al publicar texto:', textPostData);
      throw new Error('Error al publicar solo texto en Facebook');
    }

    console.log(`Publicación de texto realizada con éxito. ID: ${textPostData.id}`);

    return new Response(
      JSON.stringify({ success: true, postId: textPostData.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
