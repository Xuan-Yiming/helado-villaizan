// facebook/mensajes.ts
'use server';
import { NextResponse, NextRequest } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId");

    if (!conversationId) {
        return NextResponse.json({ error: 'Falta el parámetro conversationId' }, { status: 400 });
    }

    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion || !account.page_id) {
            throw new Error('No se encontraron datos de la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken } = account;

        // Obtener los mensajes de la conversación específica
        const conversationResponse = await fetch(`https://graph.facebook.com/v20.0/${conversationId}/messages?fields=from,to,message,created_time&access_token=${accessToken}`, { cache: "no-store" });
        const conversationData = await conversationResponse.json();

        if (!conversationResponse.ok || !conversationData.data) {
            throw new Error(`Error al obtener mensajes de la conversación de Facebook: ${conversationData.error ? conversationData.error.message : 'No se encontraron datos'}`);
        }

        // Formatear los mensajes obtenidos
        const formattedMessages = conversationData.data.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            fromUser: msg.from.name === account.usuario,
            userName: msg.from.name,
            timestamp: msg.created_time
        })).reverse(); // Invertir el orden de los mensajes

        return NextResponse.json(formattedMessages, { status: 200 });

    } catch (error) {
        console.error('Error en Facebook Mensajes API:', error);
        return NextResponse.json({ error: 'Error al obtener mensajes de la conversación de Facebook' }, { status: 500 });
    }
}
