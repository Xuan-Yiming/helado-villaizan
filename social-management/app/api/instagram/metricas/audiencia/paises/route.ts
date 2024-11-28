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
            metric: "follower_demographics",
            period: "lifetime",
            metric_type: "total_value",
            breakdown: "country",
            access_token: accessToken,
        });

        //console.log("URL de la solicitud a Instagram API (Países):", `${url}?${params.toString()}`);

        const response = await fetch(`${url}?${params.toString()}`);
        const data = await response.json();

        //console.log("Respuesta completa de Instagram API (Países):", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(`Error al obtener datos de países: ${data.error?.message}`);
        }

        const countriesData = data.data[0]?.values[0]?.value || {};
        const formattedData = Object.entries(countriesData).map(([country, count]) => ({
            name: country,
            value: count as number,
        }));

        //console.log("Datos formateados para el frontend (Países):", JSON.stringify(formattedData, null, 2));

        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        // Ordenar y tomar los 3 principales
        const topCountries = formattedData.sort((a, b) => b.value - a.value).slice(0, 3);

        return NextResponse.json(topCountries, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint países:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}
