// route.ts para Facebook Mensajes
import { NextResponse } from 'next/server';
import { get_social_account } from '@/app/lib/database';

export async function GET() {
  try {
    // Obtener el token de la página y el page_id de la base de datos
    const account = await get_social_account('facebook');
    if (!account || !account.token_autenticacion || !account.page_id) {
      throw new Error('Token de autenticación o page_id no disponibles');
    }

    const accessToken = account.token_autenticacion;
    const pageId = account.page_id;

    // Llamada al API para obtener las conversaciones
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/conversations?fields=id,message_count,name,unread_count,messages{message,created_time,from},updated_time&access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error en la respuesta de Facebook API:", data);
      throw new Error(`Error en Facebook API: ${data.error.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener mensajes de Facebook:', error);
    return NextResponse.json({ error: 'Error al obtener mensajes de Facebook' }, { status: 500 });
  }
}
