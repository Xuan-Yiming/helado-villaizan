import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Extiende dayjs con el plugin isBetween
dayjs.extend(isBetween);

interface FollowerData {
    end_time: string; // Fecha del registro
    value: number;    // Número de seguidores
}

export async function GET(request: NextRequest) {
    try {
        const account = await get_social_account("instagram");
        if (!account || !account.token_autenticacion || !account.instagram_business_account) {
            console.error("No se encontró la cuenta de Instagram en la base de datos.");
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        const { token_autenticacion: accessToken, instagram_business_account: businessAccount } = account;
        const { searchParams } = new URL(request.url);
        let startDate = searchParams.get("startDate");
        let endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            console.error("Faltan parámetros de rango de fechas.");
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        // Convertir las fechas a objetos dayjs para validaciones
        const startDateObj = dayjs(startDate);
        const endDateObj = dayjs(endDate);

        const url = `https://graph.facebook.com/v20.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "follower_count",
            period: "day",
            access_token: accessToken,
        });

        // Función recursiva para manejar el paginado y recolectar todos los datos
        const fetchAllPages = async (urlWithParams: string, collectedData: FollowerData[] = []): Promise<FollowerData[]> => {
            const response = await fetch(urlWithParams, { cache: "no-store" });
            const data = await response.json();

            if (!response.ok || !data?.data || !data.data[0]?.values) {
                //console.error(`Error al obtener los seguidores de Instagram: ${data.error?.message || "Sin datos disponibles."}`);
                return collectedData;
            }

            // Agrega los datos de esta página a la colección
            collectedData.push(...data.data[0].values);

            // Si hay un enlace "previous", continúa recolectando
            if (data.paging?.previous) {
                return fetchAllPages(data.paging.previous, collectedData);
            }

            return collectedData; // Retorna la colección completa
        };

        const fullUrl = `${url}?${params.toString()}`;
        const allFollowerData = await fetchAllPages(fullUrl);

        // Filtrar y formatear los datos dentro del rango de fechas
        const formattedData = allFollowerData
            .filter((item: FollowerData) => {
                const itemDate = dayjs(item.end_time);
                return itemDate.isBetween(startDateObj, endDateObj, "day", "[]"); // Incluye límites
            })
            .map((item: FollowerData) => ({
                name: item.end_time,
                value: item.value || 0, // Asignar 0 si no hay valor
            }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()); // Ordenar por fecha de menor a mayor

        //console.log("Datos enviados al frontend (Seguidores):", JSON.stringify(formattedData, null, 2));

        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de seguidores:", error);
        return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
    }
}
