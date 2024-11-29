import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";
import countries from "i18n-iso-countries";

// Inicializa i18n-iso-countries en español
countries.registerLocale(require("i18n-iso-countries/langs/es.json"));

type CountryData = {
    name: string; // Nombre del país
    value: number; // Valor correspondiente al país
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

        const countriesData = data.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
        if (!countriesData.length) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        // Formatear los datos y traducir los nombres de los países
        let formattedData: CountryData[] = countriesData.map((countryData: any) => ({
            name: countries.getName(countryData.dimension_values[0], "es") || countryData.dimension_values[0],
            value: countryData.value,
        }));

        

        // Ordenar y seleccionar el top 3
        formattedData = formattedData
            .sort((a: CountryData, b: CountryData) => b.value - a.value)
            .slice(0, 3);

        //console.log("Datos formateados para el frontend (Países):", JSON.stringify(formattedData, null, 2));

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint países de Instagram:", error);
        return NextResponse.json(
            [{ name: "Sin datos", value: 0 }],
            { status: 200 }
        );
    }
}
