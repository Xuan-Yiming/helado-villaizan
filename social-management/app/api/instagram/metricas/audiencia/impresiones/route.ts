import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";
import dayjs from "dayjs";

// Definir las métricas traducidas para el front
const translations: { [key: string]: string } = {
    "total_interactions": "Interacciones totales",
    "likes": "Me gusta",
    "comments": "Comentarios",
    "shares": "Compartidos",
    "saves": "Guardados",
};

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error("No se encontraron datos de la cuenta de Instagram en la base de datos");
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;

        const { searchParams } = new URL(request.url);
        let startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            throw new Error("Faltan parámetros de rango de fechas.");
        }

        const start = dayjs(startDate);
        const end = dayjs(endDate);

        // Limitar el rango de fechas a un máximo de 28 días
        if (end.diff(start, "days") > 29) {
            startDate = end.subtract(29, "days").format("YYYY-MM-DD");
        }

        const since = dayjs(startDate).format("YYYY-MM-DD");
        const until = dayjs(endDate).format("YYYY-MM-DD");

        const url = `https://graph.facebook.com/v17.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "likes,comments,shares,saves",
            period: "day",
            metric_type: "total_value",
            since,
            until,
            access_token: accessToken,
        });

        //console.log("URL de la solicitud a Instagram API (Interacciones):", `${url}?${params.toString()}`);

        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        //console.log("Respuesta completa de la API de Instagram (Interacciones):", JSON.stringify(data, null, 2));

        if (!response.ok || !data.data) {
            throw new Error(
                `Error al obtener datos de interacciones de Instagram: ${
                    data.error?.message || "Error desconocido"
                }`
            );
        }

        // Procesar las métricas para el frontend
        const interactions = data.data.map((metric: any) => {
            const totalValue = metric.total_value?.value || 0; // Asegurar que metric.total_value siempre exista
            const translatedName = translations[metric.name] || metric.name;
            return { name: translatedName, value: totalValue };
        });

        //console.log("Interacciones procesadas:", interactions);

        if (interactions.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        return NextResponse.json(interactions, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de interacciones de Instagram:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
