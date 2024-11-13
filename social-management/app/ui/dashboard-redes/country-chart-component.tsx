import React from 'react';
import { ChartData } from '@/app/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CountryChartComponentProps {
    data: ChartData[];
}

const CountryChartComponent: React.FC<CountryChartComponentProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CountryChartComponent;
