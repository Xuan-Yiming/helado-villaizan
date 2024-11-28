"use client";
import React from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma español
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale("es"); // Configura dayjs para que use español

interface LineChartProps {
    data: { name: string; value: number }[];
    metricLabel: string; // Añade una propiedad para el nombre de la métrica
}

const LineChartComponent: React.FC<LineChartProps> = ({ data, metricLabel }) => {
    // Verifica si no hay datos disponibles
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 font-medium">
                Datos no disponibles.
            </div>
        );
    }

    const formatXAxis = (tickItem: string) => {
        const date = dayjs(tickItem); // Parseamos en formato ISO
        return date.isValid() ? date.format("D MMM") : "";
    };

    const formatTooltipLabel = (label: string) => {
        const date = dayjs(label);
        return date.isValid() ? date.format("dddd, D MMM YYYY") : "";
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <Line
                    type="linear"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 14, fill: "#333" }}
                    interval={Math.floor(data.length / 6)} // Ajuste para 6-7 puntos en el eje X
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                    labelFormatter={formatTooltipLabel}
                    formatter={(value: number) => [
                        `${value.toFixed(0)}`,
                        metricLabel,
                    ]} // Muestra la métrica
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;
