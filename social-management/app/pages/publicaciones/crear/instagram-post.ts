
export const handleInstagramPost = async (
  postText: string,
  mediaFiles: Array<{ id: string; file: File; url: string; type: 'image' | 'video'; name: string }>,
  setPostStatus: (status: string) => void,
  setLoading: (loading: boolean) => void,
  accessToken: string | null
) => {
  if (!accessToken) {
    setPostStatus('No se encontró el token de acceso para Instagram.');
    return;
  }

  setLoading(true); // Activar el estado de carga
  try {
    if (mediaFiles.length > 0) {
      const isVideoPost = mediaFiles.some(file => file.type === 'video');
      const isImagePost = mediaFiles.every(file => file.type === 'image');

      if (isVideoPost && !isImagePost) {
        // Solo un video, no se permiten imágenes junto con videos
        const videoFile = mediaFiles.find(file => file.type === 'video');
        if (videoFile) {
          const fileFormData = new FormData();
          fileFormData.append('source', videoFile.file);
          if (postText) {
            fileFormData.append('caption', postText); // Añadir la descripción del video
          }

          const endpoint = `https://graph.instagram.com/me/media?access_token=${accessToken}`;

          const response = await fetch(endpoint, {
            method: 'POST',
            body: fileFormData,
          });

          const data = await response.json();

          if (response.ok && data.id) {
            setPostStatus('¡El video se ha publicado en Instagram con éxito!');
          } else {
            console.error('Error en la respuesta de Instagram:', data);
            setPostStatus(`Error al publicar en Instagram: ${data.error.message}`);
          }
        }
      } else if (isImagePost) {
        // Múltiples imágenes pero ningún video
        const uploadedMedia = [];

        for (const fileData of mediaFiles) {
          const fileFormData = new FormData();
          fileFormData.append('source', fileData.file);
          const endpoint = `https://graph.instagram.com/me/media?access_token=${accessToken}&published=false`;

          const response = await fetch(endpoint, {
            method: 'POST',
            body: fileFormData,
          });

          const data = await response.json();

          if (response.ok && data.id) {
            uploadedMedia.push({ media_fbid: data.id });
          } else {
            console.error('Error en la respuesta de Instagram:', data);
            setPostStatus(`Error al publicar en Instagram: ${data.error.message}`);
            throw new Error(data.error.message);
          }
        }

        // Crear la publicación en el feed usando los archivos subidos
        const createPostEndpoint = `https://graph.instagram.com/me/media?access_token=${accessToken}`;
        const postResponse = await fetch(createPostEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attached_media: uploadedMedia,
            caption: postText,
          }),
        });

        const postResult = await postResponse.json();
        if (postResponse.ok && postResult.id) {
          setPostStatus('¡Las fotos se han publicado en Instagram con éxito!');
        } else {
          console.error('Error al crear la publicación en Instagram:', postResult);
          setPostStatus(`Error al crear la publicación en Instagram: ${postResult.error.message}`);
        }
      } else {
        setPostStatus("No se puede mezclar imágenes y videos en una sola publicación en Instagram.");
      }
    } else {
      setPostStatus('No se encontró contenido para publicar.');
    }
  } catch (error) {
    console.error('Error al intentar realizar la publicación en Instagram:', error);
    if (error instanceof Error) {
      setPostStatus(`Ocurrió un error al publicar en Instagram: ${error.message}`);
    } else {
      setPostStatus('Ocurrió un error desconocido al intentar realizar la publicación en Instagram.');
    }
  } finally {
    setLoading(false); // Desactivar el estado de carga
  }
};
