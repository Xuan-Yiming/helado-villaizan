import { NextRequest, NextResponse } from "next/server";
import { get_social_account } from "@/app/lib/database";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extiende dayjs con los plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

interface ImpressionsData {
    end_time: string; // Fecha del registro
    value: number;    // Número de impresiones
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
        let startDateObj = dayjs(startDate);
        let endDateObj = dayjs(endDate);

        // Ajustar el endDate si incluye el día actual
        const today = dayjs().startOf("day");
        if (endDateObj.isSameOrAfter(today)) {
            endDateObj = today.subtract(1, "day");
            endDate = endDateObj.format("YYYY-MM-DD");
        }

        const url = `https://graph.facebook.com/v20.0/${businessAccount}/insights`;
        const params = new URLSearchParams({
            metric: "impressions",
            period: "day",
            access_token: accessToken,
        });

        // Función recursiva para manejar el paginado y detenerse si end_time es anterior al startDate
        const fetchAllPages = async (urlWithParams: string, collectedData: ImpressionsData[] = []): Promise<ImpressionsData[]> => {
            try {
                const response = await fetch(urlWithParams, { cache: "no-store" });
                const data = await response.json();

                //console.log("Datos recibidos de la API de Instagram (Impressions):", JSON.stringify(data, null, 2));

                if (!response.ok || !data?.data || !data.data[0]?.values) {
                    console.warn(`Advertencia: ${data.error?.message || "Sin datos disponibles."}`);
                    return collectedData;
                }

                // Agrega los datos de esta página a la colección
                const newValues = data.data[0].values;
                collectedData.push(...newValues);

                // Verifica si los datos más antiguos están antes del startDate
                const oldestDate = dayjs(newValues[newValues.length - 1]?.end_time);
                if (oldestDate.isBefore(startDateObj)) {
                    //console.warn("Se encontraron datos anteriores al rango solicitado. Deteniendo paginado.");
                    return collectedData;
                }

                // Si hay un enlace "previous", continúa recolectando
                if (data.paging?.previous) {
                    return fetchAllPages(data.paging.previous, collectedData);
                }

                return collectedData; // Retorna la colección completa
            } catch (error) {
                console.error("Error al obtener datos de la API de Instagram:", error);
                return collectedData; // Retorna los datos recolectados hasta ahora
            }
        };

        const fullUrl = `${url}?${params.toString()}`;
        const allImpressionsData = await fetchAllPages(fullUrl);

        // Filtrar y formatear los datos dentro del rango de fechas
        const formattedData = allImpressionsData
            .filter((item: ImpressionsData) => {
                const itemDate = dayjs(item.end_time);
                return itemDate.isBetween(startDateObj, endDateObj, "day", "[]"); // Incluye límites
            })
            .map((item: ImpressionsData) => ({
                name: item.end_time,
                value: item.value || 0, // Asignar 0 si no hay valor
            }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()); // Ordenar por fecha de menor a mayor

        //console.log("Datos enviados al frontend (Impressions):", JSON.stringify(formattedData, null, 2));

        if (formattedData.length === 0) {
            return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
        }

        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint de impresiones:", error);
        return NextResponse.json([{ name: "Sin datos", value: 0 }], { status: 200 });
    }
}
