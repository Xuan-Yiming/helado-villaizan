'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET() {
    try {
        const account = await get_social_account('instagram');
        if (!account || !account.token_autenticacion || !account.page_id) {
            throw new Error('No se encontraron datos de la cuenta de Instagram o Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken, page_id: pageId } = account;

        //console.log(`Obteniendo conversaciones para la página de Instagram con ID: ${pageId}`);

        // Llamar al endpoint de Graph API para obtener conversaciones de Instagram
        const url = `https://graph.facebook.com/v20.0/${pageId}/conversations?platform=instagram&fields=senders,updated_time,snippet,unread_count&access_token=${accessToken}`;
        //console.log(`URL de solicitud: ${url}`);

        const conversationsResponse = await fetch(url, { cache: 'no-store' });
        const conversationsData = await conversationsResponse.json();

        //console.log('Respuesta completa de la API:', conversationsData);

        if (!conversationsResponse.ok || !conversationsData.data) {
            throw new Error(
                `Error al obtener conversaciones de Instagram: ${conversationsData.error ? conversationsData.error.message : 'No se encontraron datos'}`
            );
        }

        // Validar si hay datos
        if (conversationsData.data.length === 0) {
            //console.log('No se encontraron conversaciones en la cuenta de Instagram.');
            return NextResponse.json([], { status: 200 });
        }

        // Formatear las conversaciones
        const formattedConversations = conversationsData.data.map((conversation: any) => ({
            id: conversation.id,
            userName: conversation.senders.data?.[0]?.name || "Usuario desconocido",
            lastMessage: conversation.snippet || "No hay mensaje",
            unreadCount: conversation.unread_count || 0,
            updatedTime: conversation.updated_time,
        }));

        //console.log('Datos formateados para el frontend:', formattedConversations);

        return NextResponse.json(formattedConversations, { status: 200 });
    } catch (error) {
        console.error('Error en Instagram Conversaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener conversaciones de Instagram' }, { status: 500 });
    }
}
