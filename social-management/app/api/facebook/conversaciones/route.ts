// facebook/conversaciones.ts
'use server';
import { NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET() {
    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion || !account.page_id) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken, page_id: pageId } = account;

        // Obtener la lista de conversaciones con el snippet del último mensaje y el conteo de mensajes no leídos
        const conversationsResponse = await fetch(`https://graph.facebook.com/v20.0/${pageId}/conversations?fields=senders,message_count,updated_time,snippet,unread_count&access_token=${accessToken}`, { cache: "no-store" });
        const conversationsData = await conversationsResponse.json();

        if (!conversationsResponse.ok || !conversationsData.data) {
            throw new Error(`Error al obtener conversaciones de Facebook: ${conversationsData.error ? conversationsData.error.message : 'No se encontraron datos'}`);
        }

        const formattedConversations = conversationsData.data.map((conversation: any) => {
            // Obtener el ID y nombre del usuario que no es la página
            const participant = conversation.senders.data.find((sender: any) => sender.id !== pageId);
            const userId = participant ? participant.id : null;
            const userName = participant ? participant.name : "Usuario desconocido";

            return {
                id: conversation.id,
                userId,  // Agregar el userId aquí
                userName,
                lastMessage: conversation.snippet || "No hay mensaje",
                messageCount: conversation.message_count,
                unreadCount: conversation.unread_count || 0,
                socialNetwork: 'facebook',
                updatedTime: conversation.updated_time
            };
        });

        return NextResponse.json(formattedConversations, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Conversaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener conversaciones de Facebook' }, { status: 500 });
    }
}
