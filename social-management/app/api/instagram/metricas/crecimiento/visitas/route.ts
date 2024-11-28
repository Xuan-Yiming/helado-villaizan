import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";
import dayjs from "dayjs";

// Define una interfaz para los datos
interface FormattedData {
    name: string;
    value: number;
}

export async function GET(request: NextRequest) {
    try {
        console.log("Endpoint Visitas al Perfil: Parámetros de entrada", request.url);

        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            console.error("No se encontraron datos de la cuenta de Instagram en la base de datos.");
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

        // Procesar los datos obtenidos
        const rawData: FormattedData[] = data.data[0]?.values.map((item: any) => ({
            name: item.end_time.split("T")[0], // Fecha sin hora
            value: item.value,
        })) || [];

        // Generar el rango completo de fechas
        const datesInRange: string[] = [];
        let currentDate = dayjs(startDate);
        const end = dayjs(endDate);

        while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
            datesInRange.push(currentDate.format("YYYY-MM-DD"));
            currentDate = currentDate.add(1, "day");
        }

        // Rellenar días faltantes con ceros
        const completeData: FormattedData[] = datesInRange.map((date) => {
            const existing = rawData.find((item: FormattedData) => item.name === date); // Tipo explícito aquí
            return existing || { name: date, value: 0 };
        });

        console.log("Datos enviados al frontend (Visitas al Perfil):", JSON.stringify(completeData, null, 2));
        return NextResponse.json(completeData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint Visitas al Perfil:", error);
        return NextResponse.json([], { status: 200 });
    }
}
