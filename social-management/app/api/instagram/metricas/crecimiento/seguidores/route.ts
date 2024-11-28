import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        console.log("Endpoint Seguidores: Parámetros de entrada", request.url);

        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            console.error("No se encontró la cuenta de Instagram en la base de datos.");
            return NextResponse.json([], { status: 200 });
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            console.error("Faltan parámetros de rango de fechas.");
            return NextResponse.json([], { status: 200 });
        }

        const url = `https://graph.facebook.com/v20.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "follower_count",
            period: "day",
            access_token: accessToken,
        });

        const response = await fetch(`${url}?${params.toString()}`, { cache: "no-store" });
        const data = await response.json();

        console.log("Datos obtenidos de la API de Instagram (Seguidores):", JSON.stringify(data, null, 2));

        if (!response.ok || !data?.data || !data.data[0]?.values) {
            console.error(`Error al obtener los seguidores de Instagram: ${data.error?.message || "Sin datos disponibles."}`);
            return NextResponse.json([], { status: 200 });
        }

        const formattedData = data.data[0].values.map((item: any) => ({
            name: item.end_time,
            value: item.value || 0, // Asignar 0 si no hay valor
        }));

        console.log("Datos enviados al frontend (Seguidores):", JSON.stringify(formattedData, null, 2));
        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de seguidores:", error);
        return NextResponse.json([], { status: 200 });
    }
}
