// api/facebook/metricas/crecimiento/engagement/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontró la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken, page_id } = account;

        // Prueba con la métrica `page_engagement`
        const response = await fetch(`https://graph.facebook.com/v20.0/${page_id}/insights/page_engagement?access_token=${accessToken}`, { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error al obtener el engagement de Facebook: ${data.error?.message}`);
        }

        return NextResponse.json(data.data, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de engagement:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
