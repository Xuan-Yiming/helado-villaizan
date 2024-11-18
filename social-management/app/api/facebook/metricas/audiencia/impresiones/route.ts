import { NextRequest, NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";
import dayjs from 'dayjs';

const translations: { [key: string]: string } = {
    "Daily Total Impressions of your posts": "Veces en que las publicaciones aparecieron en pantalla",
    "Daily Paid impressions of your posts": "Impresiones por anuncios",
    "Daily Organic impressions of your posts": "Impresiones orgánicas",
    "Daily Viral Impressions Of Your Posts": "Impresiones por amigos",
};

// Definir el tipo de cada objeto de impresiones
interface Impression {
    name: string;
    value: number;
}

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

        const since = dayjs(startDate).subtract(1, 'day').unix();
        const until = dayjs(endDate).unix();

        const impressionsResponse = await fetch(
            `https://graph.facebook.com/v20.0/${page_id}/insights/page_posts_impressions,page_posts_impressions_paid,page_posts_impressions_organic,page_posts_impressions_viral?period=day&since=${since}&until=${until}&access_token=${accessToken}`
        );
        const impressionsData = await impressionsResponse.json();

        if (!impressionsResponse.ok) {
            throw new Error(`Error al obtener datos de impresiones: ${impressionsData.error?.message}`);
        }

        // Filtra solo los datos diarios, formatea el resultado, y los ordena de mayor a menor
        const impressions: Impression[] = impressionsData.data
            .map((metric: any) => {
                const totalValue = metric.values.reduce((acc: number, entry: any) => acc + entry.value, 0);
                const translatedName = translations[metric.title] || metric.title;
                return { name: translatedName, value: totalValue };
            })
            .sort((a: Impression, b: Impression) => b.value - a.value); // Ordena de mayor a menor por el valor

        return NextResponse.json(impressions, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
