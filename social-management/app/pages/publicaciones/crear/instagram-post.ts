export const handleInstagramPost = async (
  postText: string,
  mediaFiles: Array<{ id: string; file: File; url: string; type: 'image' | 'video'; name: string }>,
  setPostStatus: (status: string) => void
) => {
  const accessToken = localStorage.getItem('facebookAccessToken'); // Token de acceso de la página de Facebook
  const instagramAccountId = localStorage.getItem('instagramAccountId'); // ID de la cuenta de Instagram Business

  console.log(`Access Token: ${accessToken}`);
  console.log(`Instagram Account ID: ${instagramAccountId}`);

  if (!accessToken || !instagramAccountId) {
      setPostStatus('No se encontró la cuenta de Instagram vinculada o el token de acceso.');
      return;
  }

  try {
      // Subir el archivo multimedia (imagen o video)
      const mediaFile = mediaFiles[0]; // Considera solo el primer archivo para la publicación

      const formData = new FormData();
      formData.append('image_url', mediaFile.url);
      formData.append('caption', postText);
      formData.append('access_token', accessToken);

      const mediaEndpoint = `https://graph.facebook.com/v15.0/${instagramAccountId}/media`;

      const mediaResponse = await fetch(mediaEndpoint, {
          method: 'POST',
          body: formData,
      });

      const mediaData = await mediaResponse.json();
      console.log('Media Upload Response:', mediaData);

      if (mediaData.error) {
          console.error('Error al subir la imagen a Instagram:', mediaData.error);
          setPostStatus(`Error al subir la imagen a Instagram: ${mediaData.error.message}`);
          return;
      }

      const creationId = mediaData.id;
      if (!creationId) {
          setPostStatus('No se pudo generar el creation_id para la publicación en Instagram.');
          return;
      }

      // Usar el creation_id para crear la publicación en Instagram
      const publishEndpoint = `https://graph.facebook.com/v15.0/${instagramAccountId}/media_publish?access_token=${accessToken}`;
      const publishResponse = await fetch(publishEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creation_id: creationId }),
      });

      const publishData = await publishResponse.json();
      console.log('Publish Response:', publishData);

      if (publishData.error) {
          console.error('Error al crear la publicación en Instagram:', publishData.error);
          setPostStatus(`Error al crear la publicación en Instagram: ${publishData.error.message}`);
      } else {
          setPostStatus('¡La publicación se ha realizado con éxito en Instagram!');
      }
  } catch (error) {
      console.error('Error al intentar publicar en Instagram:', error);
      setPostStatus('Ocurrió un error desconocido al intentar publicar en Instagram.');
  }
};
