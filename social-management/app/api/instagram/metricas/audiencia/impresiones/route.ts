import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error("No se encontraron datos de la cuenta de Instagram en la base de datos");
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;

        const url = `https://graph.facebook.com/v20.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "impressions",
            period: "days_28", // Cambiado de "day" a "days_28"
            access_token: accessToken,
        });

        // Log de la URL completa con los parámetros
        //console.log("URL de la solicitud a Instagram API (Impresiones):", `${url}?${params.toString()}`);

        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        // Log de la respuesta completa de la API
        //console.log("Respuesta completa de Instagram API (Impresiones):", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(`Error al obtener datos de impresiones: ${data.error?.message}`);
        }

        // Procesar datos de impresiones para enviarlos al frontend
        const impressions = data.data.map((metric: any) => ({
            name: "Impresiones orgánicas",
            value: metric.values.reduce((acc: number, entry: any) => acc + entry.value, 0),
        }));

        // Log de los datos procesados que se envían al frontend
        console.log("Datos formateados para el frontend (Impresiones):", JSON.stringify(impressions, null, 2));

        return NextResponse.json(impressions, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint impresiones:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
