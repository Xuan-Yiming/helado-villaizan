import { NextRequest, NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";
import dayjs from 'dayjs';
import countries from 'i18n-iso-countries';

// Inicializa i18n-iso-countries en español
countries.registerLocale(require("i18n-iso-countries/langs/es.json"));

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

        const since = dayjs(startDate).unix();
        const until = dayjs(endDate).unix();

        const response = await fetch(
            `https://graph.facebook.com/v20.0/${page_id}/insights/page_fans_country?since=${since}&until=${until}&access_token=${accessToken}`
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Error al obtener datos de países: ${data.error?.message}`);
        }

        // Formateamos los datos y traducimos los nombres de los países
        let formattedData = Object.entries(data.data[0].values[0].value || {}).map(
            ([countryCode, count]) => ({
                name: countries.getName(countryCode, "es") || countryCode,
                value: count as number,
            })
        );

        // Ordenamos en orden descendente y seleccionamos solo el top 3
        formattedData = formattedData.sort((a, b) => b.value - a.value).slice(0, 3);

        console.log("Datos formateados (Países - Top 3):", formattedData);

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint países:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
