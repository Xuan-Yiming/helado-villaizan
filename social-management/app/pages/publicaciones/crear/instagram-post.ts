export const handleInstagramPost = async (
  postText: string,
  mediaFiles: Array<{ id: string; file: File; url: string; type: 'image' | 'video'; name: string }>,
  setPostStatus: (status: string) => void
) => {
  const accessToken = localStorage.getItem('facebookAccessToken'); // Token de acceso de la página de Facebook
  const instagramAccountId = localStorage.getItem('instagramAccountId'); // ID de la cuenta de Instagram

  console.log('Access Token:', accessToken);
  console.log('Instagram Account ID:', instagramAccountId);

  if (!accessToken || !instagramAccountId) {
    setPostStatus('No se encontró la cuenta de Instagram vinculada o el token de acceso.');
    return;
  }

  try {
    // Verificamos si hay medios para publicar
    if (mediaFiles.length > 0) {
      const isImagePost = mediaFiles.every(file => file.type === 'image');
      const isVideoPost = mediaFiles.every(file => file.type === 'video');

      if (isImagePost) {
        // Publicación de imágenes en Instagram
        const uploadedMedia = [];
        for (const fileData of mediaFiles) {
          const mediaUploadResponse = await fetch(`https://graph.facebook.com/v21.0/${instagramAccountId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: fileData.url, // La URL debe ser pública y accesible
              caption: postText, // Subtítulo de la publicación
              access_token: accessToken,
            }),
          });

          const mediaData = await mediaUploadResponse.json();
          console.log('Media Upload Response:', mediaData);

          if (mediaUploadResponse.ok && mediaData.id) {
            uploadedMedia.push(mediaData.id); // Guardamos el ID del contenedor de medios creado
          } else {
            console.error('Error al subir la imagen a Instagram:', mediaData);
            setPostStatus(`Error al subir la imagen a Instagram: ${mediaData.error.message}`);
            return;
          }
        }

        // Publicar las imágenes usando el contenedor de medios creado
        const creationId = uploadedMedia[0]; // Instagram no permite publicaciones múltiples de imágenes con esta API
        const publishResponse = await fetch(`https://graph.facebook.com/v21.0/${instagramAccountId}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: creationId,
            access_token: accessToken,
          }),
        });

        const publishData = await publishResponse.json();
        console.log('Publish Response:', publishData);

        if (publishResponse.ok && publishData.id) {
          setPostStatus('¡La imagen se ha publicado con éxito en Instagram!');
        } else {
          console.error('Error al crear la publicación en Instagram:', publishData);
          setPostStatus(`Error al crear la publicación en Instagram: ${publishData.error.message}`);
        }
      } else if (isVideoPost) {
        // Publicación de un video como reel en Instagram
        const videoFile = mediaFiles[0]; // Instagram solo permite un video por reel
        const videoUploadResponse = await fetch(`https://graph.facebook.com/v21.0/${instagramAccountId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_url: videoFile.url, // La URL debe ser pública y accesible
            caption: postText, // Subtítulo del reel
            media_type: 'REELS',
            access_token: accessToken,
          }),
        });

        const videoData = await videoUploadResponse.json();
        console.log('Video Upload Response:', videoData);

        if (videoUploadResponse.ok && videoData.id) {
          // Publicar el reel utilizando el contenedor de medios creado
          const creationId = videoData.id;
          const reelPublishResponse = await fetch(`https://graph.facebook.com/v21.0/${instagramAccountId}/media_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creation_id: creationId,
              access_token: accessToken,
            }),
          });

          const reelPublishData = await reelPublishResponse.json();
          console.log('Reel Publish Response:', reelPublishData);

          if (reelPublishResponse.ok && reelPublishData.id) {
            setPostStatus('¡El reel se ha publicado con éxito en Instagram!');
          } else {
            console.error('Error al crear el reel en Instagram:', reelPublishData);
            setPostStatus(`Error al crear el reel en Instagram: ${reelPublishData.error.message}`);
          }
        } else {
          console.error('Error al subir el video a Instagram:', videoData);
          setPostStatus(`Error al subir el video a Instagram: ${videoData.error.message}`);
        }
      } else {
        setPostStatus('Solo se pueden subir imágenes o videos individualmente a Instagram.');
      }
    } else {
      setPostStatus('No hay medios para publicar en Instagram.');
    }
  } catch (error) {
    console.error('Error al intentar publicar en Instagram:', error);
    setPostStatus('Ocurrió un error desconocido al intentar publicar en Instagram.');
  }
};
