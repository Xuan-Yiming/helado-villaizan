import React from 'react';
import { ChartData } from '@/app/lib/types';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

interface AgeGenderChartComponentProps {
    data: ChartData[];
}

const COLORS = ['#FF8042', '#8884D8']; // Colores para diferenciar entre géneros

const AgeGenderChartComponent: React.FC<AgeGenderChartComponentProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AgeGenderChartComponent;
