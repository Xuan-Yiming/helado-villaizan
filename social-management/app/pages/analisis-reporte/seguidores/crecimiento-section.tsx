// app/ui/dashboard-redes/crecimiento-section.tsx
"use client";
import React, { useState, useEffect } from 'react';
import GraphContainer from '@/app/ui/dashboard-redes/graph-container';
import LineChartComponent from '@/app/ui/dashboard-redes/line-chart-component';
import { ChartData } from '@/app/lib/types';

interface CrecimientoSectionProps {
    selectedMetric: 'alcance' | 'interacciones' | 'seguidores' | 'visitas';
    setSelectedMetric: React.Dispatch<React.SetStateAction<'alcance' | 'interacciones' | 'seguidores' | 'visitas'>>;
    appliedDateRange: { start: Date; end: Date } | null;
    network: string;
}

const CrecimientoSection: React.FC<CrecimientoSectionProps> = ({ selectedMetric, setSelectedMetric, appliedDateRange, network }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        fetchChartData(selectedMetric);
    }, [selectedMetric]);

    const fetchChartData = (metric: 'alcance' | 'interacciones' | 'seguidores' | 'visitas') => {
        let data: ChartData[] = [];
        let metricTitle = '';

        switch (metric) {
            case 'alcance':
                data = [
                    { name: '14 Oct', value: 2 },
                    { name: '19 Oct', value: 6 },
                    { name: '24 Oct', value: 3 },
                    { name: '29 Oct', value: 7 },
                    { name: '3 Nov', value: 5 },
                ];
                metricTitle = `Alcance de ${network.charAt(0).toUpperCase() + network.slice(1)}`;
                break;
            case 'interacciones':
                data = [
                    { name: '14 Oct', value: 3 },
                    { name: '19 Oct', value: 4 },
                    { name: '24 Oct', value: 2 },
                    { name: '29 Oct', value: 6 },
                    { name: '3 Nov', value: 8 },
                ];
                metricTitle = `Interacciones con el contenido de ${network.charAt(0).toUpperCase() + network.slice(1)}`;
                break;
            case 'seguidores':
                data = [
                    { name: '14 Oct', value: 1 },
                    { name: '19 Oct', value: 1 },
                    { name: '24 Oct', value: 2 },
                    { name: '29 Oct', value: 3 },
                    { name: '3 Nov', value: 1 },
                ];
                metricTitle = `Seguidores de ${network.charAt(0).toUpperCase() + network.slice(1)}`;
                break;
            case 'visitas':
                data = [
                    { name: '14 Oct', value: 3 },
                    { name: '19 Oct', value: 0 },
                    { name: '24 Oct', value: 1 },
                    { name: '29 Oct', value: 5 },
                    { name: '3 Nov', value: 4 },
                ];
                metricTitle = `Visitas en ${network.charAt(0).toUpperCase() + network.slice(1)}`;
                break;
        }

        setChartData(data);
        setTitle(metricTitle);
    };

    return (
        <GraphContainer title={`Crecimiento de ${network.charAt(0).toUpperCase() + network.slice(1)}`}>
            <div className="flex flex-col mt-2 mb-4 w-80"> {/* Ajustado el ancho del selector */}
                <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="metric-filter">Métrica de Crecimiento</label>
                <select
                    id="metric-filter"
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring focus:border-blue-300 w-full"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as 'alcance' | 'interacciones' | 'seguidores' | 'visitas')}
                >
                    <option value="alcance">Alcance</option>
                    <option value="interacciones">Interacciones</option>
                    <option value="seguidores">Seguidores</option>
                    <option value="visitas">Visitas</option>
                </select>
            </div>
            <LineChartComponent data={chartData} />
        </GraphContainer>
    );
};

export default CrecimientoSection;
