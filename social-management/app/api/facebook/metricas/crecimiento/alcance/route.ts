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

        // Ajustamos la fecha de inicio restando un día para asegurar que se incluya correctamente
        const since = dayjs(startDate).subtract(1, 'day').unix();
        const until = dayjs(endDate).unix();

        const response = await fetch(
            `https://graph.facebook.com/v20.0/${page_id}/insights/page_impressions_unique?period=day&since=${since}&until=${until}&access_token=${accessToken}`,
            { cache: 'no-store' }
        );

        const data = await response.json();
        //console.log("Datos obtenidos de la API de Facebook:", data);

        if (!response.ok) {
            throw new Error(`Error al obtener el alcance de Facebook: ${data.error?.message}`);
        }

        const formattedData = data.data[0].values.map((item: any) => {
            // Restamos un día a la fecha obtenida para corregir el desfase en la API de Facebook
            const adjustedDate = dayjs(item.end_time).subtract(1, 'day').format('YYYY-MM-DD');
            return {
                name: adjustedDate,
                value: item.value,
            };
        });

        //console.log("Datos formateados enviados al frontend:", formattedData);

        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de alcance:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
