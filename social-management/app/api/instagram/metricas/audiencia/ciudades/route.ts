import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error("No se encontraron datos de la cuenta de Instagram en la base de datos");
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;

        const url = `https://graph.facebook.com/v17.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "follower_demographics",
            period: "lifetime",
            metric_type: "total_value",
            breakdown: "city",
            access_token: accessToken,
        });

        //console.log("URL de la solicitud a Instagram API (Ciudades):", `${url}?${params.toString()}`);

        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        //console.log("Respuesta completa de Instagram API (Ciudades):", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(`Error al obtener datos de ciudades: ${data.error?.message}`);
        }

        if (data.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        const citiesData = data.data[0]?.values[0]?.value || {};
        const formattedData = Object.entries(citiesData).map(([city, count]) => ({
            name: city,
            value: count as number,
        }));


        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }
        //console.log("Datos formateados para el frontend (Ciudades):", JSON.stringify(formattedData, null, 2));

        // Ordenar y tomar las 10 principales
        const topCities = formattedData.sort((a, b) => b.value - a.value).slice(0, 10);

        return NextResponse.json(topCities, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint ciudades:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
