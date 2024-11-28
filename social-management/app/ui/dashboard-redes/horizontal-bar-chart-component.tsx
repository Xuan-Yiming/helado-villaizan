import React from 'react';
import { ChartData } from '@/app/lib/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';

interface HorizontalBarChartComponentProps {
    data: ChartData[];
}

const HorizontalBarChartComponent: React.FC<HorizontalBarChartComponentProps> = ({ data }) => {
    const barHeight = 15; // Grosor fijo de cada barra
    const barGap = 20; // Espacio fijo entre cada barra
    const chartHeight = data.length * (barHeight + barGap) + 40; // Altura calculada dinámicamente

    // Verifica si no hay datos disponibles
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 font-medium">
                Datos no disponibles.
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, left: 20, right: 40, bottom: 5 }} // Añadir margen superior
                    barCategoryGap={barGap} // Espacio fijo entre barras
                >
                    <XAxis type="number" hide />
                    <YAxis type="category" width={80} hide /> {/* Ocultar YAxis */}
                    <Bar dataKey="value" fill="#8884d8" barSize={barHeight}>
                        <LabelList
                            dataKey="name"
                            position="top"
                            content={({ x = 0, y = 0, value }) => (
                                <text
                                    x={Number(x)} // Posicionar a la izquierda de la barra
                                    y={Number(y) - 4} // Posicionar encima de la barra
                                    textAnchor="start" // Alinear al inicio (izquierda)
                                    fill="#555"
                                    fontSize={12}
                                >
                                    {value}
                                </text>
                            )}
                        />
                        <LabelList
                            dataKey="value"
                            position="right"
                            style={{ fill: '#555', fontSize: 12 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HorizontalBarChartComponent;
