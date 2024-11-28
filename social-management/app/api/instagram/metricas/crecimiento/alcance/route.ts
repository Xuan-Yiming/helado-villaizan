import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        console.log("Endpoint Alcance: Parámetros de entrada", request.url);

        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            console.error("No se encontraron datos de la cuenta de Instagram en la base de datos.");
            return NextResponse.json([], { status: 200 });
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;

        const url = `https://graph.facebook.com/v17.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "reach",
            period: "day",
            access_token: accessToken,
        });

        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        console.log("Datos obtenidos de la API de Instagram (Alcance):", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error(`Error al obtener el alcance de Instagram: ${data.error?.message}`);
            return NextResponse.json([], { status: 200 });
        }

        const formattedData = data.data[0]?.values.map((item: any) => ({
            name: item.end_time.split("T")[0], // Fecha sin hora
            value: item.value,
        })) || [];

        console.log("Datos enviados al frontend (Alcance):", JSON.stringify(formattedData, null, 2));
        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint Alcance:", error);
        return NextResponse.json([], { status: 200 });
    }
}
