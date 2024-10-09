export const handleInstagramPost = async (
  postText: string,
  mediaFiles: Array<{ id: string; file: File; url: string; type: 'image' | 'video'; name: string }>,
  setPostStatus: (status: string) => void
) => {
  const accessToken = localStorage.getItem('facebookAccessToken'); // Token de acceso de la página de Facebook
  const instagramAccountId = localStorage.getItem('instagramAccountId'); // Instagram Business Account ID

  if (!accessToken || !instagramAccountId) {
      console.log('Access Token:' + accessToken);
      console.log('Instagram id' + instagramAccountId);
      setPostStatus('No se encontró la cuenta de Instagram vinculada o el token de acceso.');
      return;
  }

  try {
      if (mediaFiles.length > 0) {
          const isImagePost = mediaFiles.every(file => file.type === 'image');
          
          if (isImagePost) {
              // Subir las imágenes al contenedor de medios de Instagram
              const uploadedMedia = [];
              for (const fileData of mediaFiles) {
                  const fileFormData = new FormData();
                  fileFormData.append('image_url', fileData.url); // Usar la URL del archivo para subir la imagen
                  fileFormData.append('access_token', accessToken);
                  fileFormData.append('caption', postText);

                  const endpoint = `https://graph.facebook.com/v15.0/${instagramAccountId}/media`;
                  const response = await fetch(endpoint, { method: 'POST', body: fileFormData });
                  const data = await response.json();

                  if (response.ok && data.id) {
                      uploadedMedia.push(data.id); // Almacenar el ID de cada imagen subida
                  } else {
                      console.error('Error al subir la imagen a Instagram:', data);
                      setPostStatus(`Error al subir la imagen a Instagram: ${data.error.message}`);
                  }
              }

              // Crear una publicación en Instagram con las imágenes subidas
              const createPostEndpoint = `https://graph.facebook.com/v15.0/${instagramAccountId}/media_publish?access_token=${accessToken}`;
              const postResponse = await fetch(createPostEndpoint, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ creation_id: uploadedMedia[0] }), // Usar la primera imagen para la publicación
              });

              const postResult = await postResponse.json();
              if (postResponse.ok && postResult.id) {
                  setPostStatus('¡Las fotos se han publicado con éxito en Instagram!');
              } else {
                  console.error('Error al crear la publicación en Instagram:', postResult);
                  setPostStatus(`Error al crear la publicación en Instagram: ${postResult.error.message}`);
              }
          } else {
              setPostStatus('Instagram solo admite publicaciones con imágenes.');
          }
      } else {
          // Publicación solo con texto (Instagram no permite solo texto, así que mostramos un error)
          setPostStatus('Instagram no permite publicaciones que solo contengan texto.');
      }
  } catch (error) {
      console.error('Error al intentar publicar en Instagram:', error);
      setPostStatus('Ocurrió un error desconocido al intentar publicar en Instagram.');
  }
};
