'use server';
import { Post } from "@/app/lib/types";
import { get_social_account } from "@/app/lib/database";

export async function POST(req: Request) {
  try {
    const post: Post = await req.json();
    console.log("Datos recibidos para Instagram:", post);

    const account = await get_social_account('instagram');
    if (!account || !account.token_autenticacion || !account.instagram_business_account) {
      throw new Error('Faltan datos de la cuenta de Instagram');
    }

    const { token_autenticacion: accessToken, instagram_business_account: instagramBusinessId } = account;

    if (!post.media || post.media.length === 0) {
      throw new Error('Instagram requiere al menos un archivo multimedia para publicar.');
    }

    const mediaUrls = post.media;
    const isSingleMedia = mediaUrls.length === 1;

    // Caso 1: Publicación de una sola imagen o video
    if (isSingleMedia) {
      const mediaUrl = mediaUrls[0];
      const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov');
      const formData = new FormData();

      if (isVideo) {
        formData.append('video_url', mediaUrl);
        formData.append('media_type', 'VIDEO');
      } else {
        formData.append('image_url', mediaUrl);
      }

      formData.append('access_token', accessToken);
      if (post.content) {
        formData.append('caption', post.content);
      }

      console.log('Creando contenedor individual para:', mediaUrl);

      const response = await fetch(
        `https://graph.facebook.com/v14.0/${instagramBusinessId}/media`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      if (!data.id) {
        console.error('Error al crear contenedor:', data);
        throw new Error('Error al crear contenedor de medios');
      }

      const creationId = data.id;
      console.log(`Contenedor creado con éxito. ID: ${creationId}`);

      return await publishMedia(creationId, accessToken, post, instagramBusinessId);
    }

    // Caso 2: Publicación de un carrusel con múltiples imágenes/videos
    const mediaIds: string[] = [];

    for (const mediaUrl of mediaUrls) {
      const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov');
      const formData = new FormData();

      if (isVideo) {
        formData.append('video_url', mediaUrl);
        formData.append('media_type', 'VIDEO');
      } else {
        formData.append('image_url', mediaUrl);
        formData.append('is_carousel_item', 'true');
      }

      formData.append('access_token', accessToken);

      console.log('Creando contenedor para:', mediaUrl);

      const response = await fetch(
        `https://graph.facebook.com/v14.0/${instagramBusinessId}/media`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      if (!data.id) {
        console.error('Error al crear contenedor:', data);
        throw new Error('Error al crear contenedor de medios');
      }

      console.log(`Contenedor creado con éxito. ID: ${data.id}`);
      mediaIds.push(data.id);
    }

    if (mediaIds.length < 2 || mediaIds.length > 10) {
      throw new Error('El carrusel debe contener entre 2 y 10 elementos.');
    }

    const carouselResponse = await fetch(
      `https://graph.facebook.com/v14.0/${instagramBusinessId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: mediaIds,
          access_token: accessToken,
          caption: post.content || '',
        }),
      }
    );

    const carouselData = await carouselResponse.json();

    if (!carouselData.id) {
      console.error('Error al crear contenedor del carrusel:', carouselData);
      throw new Error('Error al crear contenedor del carrusel en Instagram');
    }

    const creationId = carouselData.id;
    console.log(`Contenedor del carrusel creado con éxito. ID: ${creationId}`);

    return await publishMedia(creationId, accessToken, post, instagramBusinessId);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function publishMedia(creationId: string, accessToken: string, post: Post, instagramBusinessId: string) {
  const publishBody: any = {
    creation_id: creationId,
    access_token: accessToken,
  };

  if (post.status === 'programado' && post.post_time) {
    const scheduledPublishTime = Math.floor(new Date(post.post_time).getTime() / 1000);
    publishBody.scheduled_publish_time = scheduledPublishTime;
  }

  console.log('Publicando en Instagram...');
  const publishResponse = await fetch(
    `https://graph.facebook.com/v14.0/${instagramBusinessId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishBody),
    }
  );

  const publishData = await publishResponse.json();

  if (!publishData.id) {
    console.error('Error al publicar en Instagram:', publishData);
    throw new Error('Error al publicar en Instagram');
  }

  console.log(`Publicación realizada con éxito. ID: ${publishData.id}`);
  return new Response(
    JSON.stringify({ success: true, postId: publishData.id }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
