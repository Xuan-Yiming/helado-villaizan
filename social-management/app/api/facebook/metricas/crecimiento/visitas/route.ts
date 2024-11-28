// api/facebook/metricas/crecimiento/visitas/route.ts
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

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            throw new Error("Faltan parámetros de rango de fechas.");
        }

        // Ajuste de fecha de inicio, restando un día para incluir correctamente el rango
        const since = dayjs(startDate).subtract(1, 'day').unix();
        const until = dayjs(endDate).unix();

        // Consulta la métrica de visitas
        const response = await fetch(
            `https://graph.facebook.com/v20.0/${page_id}/insights/page_views_total?period=day&since=${since}&until=${until}&access_token=${accessToken}`,
            { cache: 'no-store' }
        );

        const data = await response.json();
        //console.log("Datos obtenidos de la API de Facebook (Visitas):", data);

        if (!response.ok) {
            throw new Error(`Error al obtener la métrica de visitas de Facebook: ${data.error?.message}`);
        }

        // Generar el rango de fechas completo desde `startDate` hasta `endDate`
        const datesInRange = [];
        let currentDate = dayjs(startDate);
        const end = dayjs(endDate);

        while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
            datesInRange.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }

        // Si `data.data[0]?.values` no tiene valores, rellenamos todas las fechas con 0
        const values = data.data[0]?.values || [];
        const formattedData = datesInRange.map(date => {
            const match = values.find((item: any) => dayjs(item.end_time).subtract(1, 'day').format('YYYY-MM-DD') === date);
            return {
                name: date,
                value: match ? match.value : 0
            };
        });

        //console.log("Datos formateados enviados al frontend (Visitas):", formattedData);

        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de visitas:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
