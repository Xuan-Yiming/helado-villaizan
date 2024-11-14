"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartData } from '@/app/lib/types';

interface ImpressionChartComponentProps {
    data: ChartData[];
    metricLabel: string; // Etiqueta para mostrar en el tooltip
}

const COLORS = ['#D50000', '#4A148C', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6680', '#82CA9D', '#FFD700', '#FF7F50'];

const ImpressionChartComponent: React.FC<ImpressionChartComponentProps> = ({ data, metricLabel }) => {
    const totalImpressions = data.reduce((acc, entry) => acc + entry.value, 0);

    const processedData = data.map((entry) => ({
        ...entry,
        percentage: ((entry.value / totalImpressions) * 100).toFixed(1) + '%',
    }));

    return (
        <div style={{ width: '100%', height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={processedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70} // Hace el gráfico de tipo "dona"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ percentage }) => `${percentage}`}
                    >
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} impresiones`} />
                </PieChart>
            </ResponsiveContainer>
            <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{
                    maxWidth: '90%',
                    marginTop: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    textAlign: 'center'
                }}
                payload={processedData.map((entry, index) => ({
                    id: entry.name,
                    type: 'square',
                    value: `${entry.name}: ${entry.percentage}`,
                    color: COLORS[index % COLORS.length],
                }))}
            />
        </div>
    );
};

export default ImpressionChartComponent;
