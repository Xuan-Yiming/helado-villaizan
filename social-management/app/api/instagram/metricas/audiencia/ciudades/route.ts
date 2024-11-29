import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";

type CityData = {
    name: string; // Nombre de la ciudad
    value: number; // Valor correspondiente a la ciudad
};

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            throw new Error("No se encontraron datos de la cuenta de Instagram en la base de datos");
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;

        const url = `https://graph.facebook.com/v21.0/${businessAccount}/insights`;
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

        // Validar datos anidados
        const citiesData = data.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
        if (!citiesData.length) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        // Formatear los datos
        let formattedData: CityData[] = citiesData.map((cityData: any) => ({
            name: cityData.dimension_values[0], // Nombre de la ciudad
            value: cityData.value, // Valor correspondiente a la ciudad
        }));

        

        // Ordenar en orden descendente y seleccionar el top 10
        formattedData = formattedData
            .sort((a: CityData, b: CityData) => b.value - a.value)
            .slice(0, 10);

        //console.log("Datos formateados para el frontend (Ciudades):", JSON.stringify(formattedData, null, 2));

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint ciudades de Instagram:", error);
        return NextResponse.json(
            [{ name: "Sin datos", value: 0 }],
            { status: 200 }
        );
    }
}
