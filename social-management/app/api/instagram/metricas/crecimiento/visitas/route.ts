import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        console.log("Endpoint Visitas al Perfil: Parámetros de entrada", request.url);

        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            console.error("No se encontraron datos de la cuenta de Instagram en la base de datos.");
            return NextResponse.json([], { status: 200 });
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;

        const url = `https://graph.facebook.com/v17.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "profile_views",
            period: "day",
            access_token: accessToken,
        });

        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        console.log("Datos obtenidos de la API de Instagram (Visitas al Perfil):", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error(`Error al obtener las visitas al perfil de Instagram: ${data.error?.message}`);
            return NextResponse.json([], { status: 200 });
        }

        const formattedData = data.data[0]?.values.map((item: any) => ({
            name: item.end_time.split("T")[0],
            value: item.value,
        })) || [];

        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        console.log("Datos enviados al frontend (Visitas al Perfil):", JSON.stringify(formattedData, null, 2));
        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint Visitas al Perfil:", error);
        return NextResponse.json([], { status: 200 });
    }
}
