import { NextRequest, NextResponse } from 'next/server';
import { get_social_account } from "@/app/lib/database";
import dayjs from 'dayjs';

const translations: { [key: string]: string } = {
    "Daily Total Impressions of your posts": "Impresiones totales diarias de tus publicaciones",
    "Daily Reach Of Page Posts": "Alcance diario de las publicaciones de la página",
    "Daily Paid impressions of your posts": "Impresiones pagadas diarias de tus publicaciones",
    "Daily Organic Reach of Page posts": "Alcance orgánico diario de las publicaciones de la página",
    "Daily Served Organic Reach of Page Posts": "Alcance orgánico servido diario de las publicaciones de la página",
    "Daily Viral Impressions Of Your Posts": "Impresiones virales diarias de tus publicaciones",
    "Daily Viral Reach Of Page Posts": "Alcance viral diario de las publicaciones de la página",
    "Daily Nonviral Impressions Of Your Posts": "Impresiones no virales diarias de tus publicaciones",
    "Daily Nonviral reach of Page Posts": "Alcance no viral diario de las publicaciones de la página"
};

export async function GET(request: NextRequest) {
    try {
        console.log("Iniciando el endpoint de impresiones de publicaciones diarias");

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

        console.log("Fechas en formato UNIX:", { since, until });

        // Realiza la solicitud para obtener solo las impresiones diarias de las publicaciones
        const impressionsResponse = await fetch(
            `https://graph.facebook.com/v20.0/${page_id}/insights/page_posts_impressions,page_posts_impressions_unique,page_posts_impressions_paid,page_posts_impressions_organic_unique,page_posts_served_impressions_organic_unique,page_posts_impressions_viral,page_posts_impressions_viral_unique,page_posts_impressions_nonviral,page_posts_impressions_nonviral_unique?period=day&since=${since}&until=${until}&access_token=${accessToken}`
        );
        const impressionsData = await impressionsResponse.json();

        console.log("Respuesta de la API de impresiones de publicaciones diarias:", impressionsData);

        if (!impressionsResponse.ok) {
            throw new Error(`Error al obtener datos de impresiones: ${impressionsData.error?.message}`);
        }

        // Filtra solo los datos diarios y formatea el resultado
        const impressions = impressionsData.data.map((metric: any) => {
            const totalValue = metric.values.reduce((acc: number, entry: any) => acc + entry.value, 0);
            const translatedName = translations[metric.title] || metric.title; // Traduce el título si existe en el objeto de traducciones
            return { name: translatedName, value: totalValue };
        });

        console.log("Datos formateados de impresiones diarias:", impressions);

        return NextResponse.json(impressions, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de impresiones diarias:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
