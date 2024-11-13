import { NextRequest, NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";
import dayjs from 'dayjs';

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account('facebook');
        if (!account || !account.token_autenticacion) {
            throw new Error('No se encontró la cuenta de Facebook en la base de datos');
        }

        const { token_autenticacion: accessToken, page_id } = account;

        // Leer el rango de fechas de los parámetros de la URL
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            throw new Error("Faltan parámetros de rango de fechas.");
        }

        // Ajuste en `since` restando un día
        const since = dayjs(startDate).subtract(1, 'day').unix();
        const until = dayjs(endDate).unix();

        // Consulta la métrica de engagement
        const response = await fetch(
            `https://graph.facebook.com/v20.0/${page_id}/insights/page_post_engagements?period=day&since=${since}&until=${until}&access_token=${accessToken}`,
            { cache: 'no-store' }
        );

        const data = await response.json();
        console.log("Datos obtenidos de la API de Facebook (Engagement):", data);

        if (!response.ok) {
            throw new Error(`Error al obtener el engagement de Facebook: ${data.error?.message}`);
        }

        // Formatear los datos
        const formattedData = data.data[0].values.map((item: any) => {
            // Restar un día a la fecha obtenida para corregir el desfase
            const adjustedDate = dayjs(item.end_time).subtract(1, 'day').format('YYYY-MM-DD');
            return {
                name: adjustedDate,
                value: item.value,
            };
        });

        console.log("Datos formateados enviados al frontend (Engagement):", formattedData);

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de engagement:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
