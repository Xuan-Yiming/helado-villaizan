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

        console.log("Obteniendo conversaciones para la página:", pageId);

        // Obtener la lista de conversaciones
        const conversationsResponse = await fetch(
            `https://graph.facebook.com/v20.0/${pageId}/conversations?fields=senders,message_count,updated_time,snippet,unread_count&access_token=${accessToken}`,
            { cache: "no-store" }
        );
        const conversationsData = await conversationsResponse.json();

        console.log("Estado de la respuesta de Facebook:", conversationsResponse.status);
        console.log("Datos recibidos de Facebook:", conversationsData);

        if (!conversationsResponse.ok || !Array.isArray(conversationsData.data) || conversationsData.data.length === 0) {
            console.log("No se encontraron conversaciones activas.");
            return NextResponse.json([], { status: 200 }); // Devuelve un array vacío si no hay datos
        }

        const formattedConversations = conversationsData.data.map((conversation: any) => {
            // Obtener el ID y nombre del usuario que no es la página
            const participant = conversation?.senders?.data?.find((sender: any) => sender.id !== pageId);
            const userId = participant ? participant.id : null;
            const userName = participant ? participant.name : "Usuario desconocido";

            return {
                id: conversation.id || "Sin ID",
                userId: userId || "Desconocido",
                userName,
                lastMessage: conversation.snippet || "No hay mensaje",
                messageCount: conversation.message_count || 0,
                unreadCount: conversation.unread_count || 0,
                socialNetwork: 'facebook',
                updatedTime: conversation.updated_time || null,
            };
        });

        //console.log("Conversaciones formateadas:", formattedConversations);

        return NextResponse.json(formattedConversations, { status: 200 });
    } catch (error) {
        console.error('Error en Facebook Conversaciones API:', error);
        return NextResponse.json({ error: 'Error al obtener conversaciones de Facebook' }, { status: 500 });
    }
}
