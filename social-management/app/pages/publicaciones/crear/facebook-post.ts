export const handleFacebookPost = async (
    postText: string,
    mediaFiles: Array<{ id: string; file: File; url: string; type: 'image' | 'video'; name: string }>,
    setPostStatus: (status: string) => void
  ) => {
    const accessToken = localStorage.getItem('facebookAccessToken');
    const pageId = localStorage.getItem('facebookPageId');
  
    if (!accessToken || !pageId) {
      setPostStatus('No se pudo encontrar el token de acceso o el ID de la página.');
      return;
    }
  
    let endpoint = '';
  
    try {
      if (mediaFiles.length > 0) {
        const isVideoPost = mediaFiles.some(file => file.type === 'video');
        const isImagePost = mediaFiles.every(file => file.type === 'image');
  
        if (isVideoPost && !isImagePost) {
          // Solo video
          const videoFile = mediaFiles.find(file => file.type === 'video');
          if (videoFile) {
            const fileFormData = new FormData();
            fileFormData.append('source', videoFile.file);
            if (postText) {
              fileFormData.append('description', postText);
            }
            endpoint = `https://graph.facebook.com/${pageId}/videos?access_token=${accessToken}`;
  
            const response = await fetch(endpoint, { method: 'POST', body: fileFormData });
            const data = await response.json();
  
            if (response.ok && data.id) {
              setPostStatus('¡El video se ha publicado con éxito en Facebook!');
            } else {
              console.error('Error en la respuesta:', data);
              setPostStatus(`Error al publicar el video en Facebook: ${data.error.message}`);
            }
          }
        } else if (isImagePost) {
          // Solo imágenes
          const uploadedMedia = [];
          for (const fileData of mediaFiles) {
            const fileFormData = new FormData();
            fileFormData.append('source', fileData.file);
            endpoint = `https://graph.facebook.com/${pageId}/photos?access_token=${accessToken}&published=false`;
  
            const response = await fetch(endpoint, { method: 'POST', body: fileFormData });
            const data = await response.json();
  
            if (response.ok && data.id) {
              uploadedMedia.push({ media_fbid: data.id });
            } else {
              console.error('Error en la respuesta:', data);
              setPostStatus(`Error al publicar imágenes en Facebook: ${data.error.message}`);
            }
          }
  
          // Crear la publicación en el feed con las imágenes subidas
          const createPostEndpoint = `https://graph.facebook.com/${pageId}/feed?access_token=${accessToken}`;
          const postResponse = await fetch(createPostEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attached_media: uploadedMedia, message: postText }),
          });
  
          const postResult = await postResponse.json();
          if (postResponse.ok && postResult.id) {
            setPostStatus('¡Las fotos se han publicado con éxito en Facebook!');
          } else {
            console.error('Error al crear la publicación:', postResult);
            setPostStatus(`Error al crear la publicación en Facebook: ${postResult.error.message}`);
          }
        } else {
          setPostStatus('No se puede mezclar imágenes y videos en una sola publicación en Facebook.');
        }
      } else {
        // Publicación solo con texto
        const textPostEndpoint = `https://graph.facebook.com/${pageId}/feed?access_token=${accessToken}`;
        const textResponse = await fetch(textPostEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: postText }),
        });
  
        const textData = await textResponse.json();
        if (textResponse.ok && textData.id) {
          setPostStatus('¡La publicación de texto se ha realizado con éxito en Facebook!');
        } else {
          console.error('Error en la respuesta:', textData);
          setPostStatus(`Error al publicar el texto en Facebook: ${textData.error.message}`);
        }
      }
    } catch (error) {
      console.error('Error al intentar publicar en Facebook:', error);
      setPostStatus('Ocurrió un error desconocido al intentar publicar en Facebook.');
    }
  };
  