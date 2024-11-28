import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        //console.log("Endpoint Engagement: Parámetros de entrada", request.url);

        // Obtiene la cuenta de Instagram
        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            console.error("No se encontró la cuenta de Instagram en la base de datos.");
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Valida que se hayan enviado las fechas
        if (!startDate || !endDate) {
            console.error("Faltan parámetros de rango de fechas.");
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        // Construye la URL para la API de Instagram
        const url = `https://graph.facebook.com/v20.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "total_interactions",
            period: "day",
            metric_type: "total_value",
            access_token: accessToken,
        });

        const response = await fetch(`${url}?${params.toString()}`, { cache: "no-store" });
        const data = await response.json();

        //console.log("Datos obtenidos de la API de Instagram (Engagement):", JSON.stringify(data, null, 2));

        // Verifica si hay un error o datos vacíos en la respuesta
        if (!response.ok || !data?.data || !data.data[0]?.values) {
            console.error(`Error al obtener el engagement de Instagram: ${data.error?.message || "Sin datos disponibles."}`);
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        // Formatea los datos obtenidos
        const formattedData = data.data[0].values.map((item: any) => ({
            name: item.end_time,
            value: item.value || 0, // Asignar 0 si no hay valor
        }));

        // Si el arreglo formateado está vacío, devuelve "Sin datos"
        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        //console.log("Datos enviados al frontend (Engagement):", JSON.stringify(formattedData, null, 2));
        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de engagement:", error);
        // En caso de error, siempre devuelve "Sin datos"
        return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
    }
}
