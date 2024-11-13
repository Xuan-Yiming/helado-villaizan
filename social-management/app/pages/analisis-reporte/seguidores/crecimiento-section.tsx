"use client";
import React, { useState, useEffect } from 'react';
import GraphContainer from '@/app/ui/dashboard-redes/graph-container';
import LineChartComponent from '@/app/ui/dashboard-redes/line-chart-component';
import { ChartData } from '@/app/lib/types';

interface CrecimientoSectionProps {
    selectedMetric: 'alcance' | 'engagement' | 'seguidores' | 'visitas' | null;
    setSelectedMetric: React.Dispatch<React.SetStateAction<'alcance' | 'engagement' | 'seguidores' | 'visitas' | null>>;
    appliedDateRange: { start: Date; end: Date } | null;
    network: string;
}

const CrecimientoSection: React.FC<CrecimientoSectionProps> = ({ selectedMetric, setSelectedMetric, appliedDateRange, network }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [title, setTitle] = useState<string>('Seleccione una métrica para ver los datos');

    useEffect(() => {
        if (appliedDateRange && selectedMetric) {
            console.log("Fetching data for metric:", selectedMetric);
            fetchChartData(selectedMetric);
        }
    }, [selectedMetric, appliedDateRange]);

    const fetchChartData = async (metric: 'alcance' | 'engagement' | 'seguidores' | 'visitas') => {
        if (!appliedDateRange) return;
    
        const startDate = appliedDateRange.start.toISOString();
        const endDate = appliedDateRange.end.toISOString();
    
        try {
            const response = await fetch(`/api/facebook/metricas/crecimiento/${metric}?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
    
            const formattedData = data.map((item: any) => ({
                name: item.name,
                value: item.value,
            }));
    
            console.log("Datos formateados para LineChartComponent:", formattedData);
            setChartData(formattedData);
            setTitle(`Crecimiento en ${capitalizeMetric(metric)}`);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    const capitalizeMetric = (metric: string) => {
        return metric.charAt(0).toUpperCase() + metric.slice(1);
    };

    return (
        <GraphContainer title={title}>
            <div className="flex flex-col mt-2 mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="metric-filter">Métrica de Crecimiento</label>
                <select
                    id="metric-filter"
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                    value={selectedMetric || ""}
                    onChange={(e) => setSelectedMetric(e.target.value as 'alcance' | 'engagement' | 'seguidores' | 'visitas')}
                >
                    <option value="" disabled hidden>Seleccione una métrica</option>
                    <option value="alcance">Alcance</option>
                    <option value="engagement">Engagement</option>
                    <option value="seguidores">Seguidores</option>
                    <option value="visitas">Visitas</option>
                </select>
            </div>
            <LineChartComponent data={chartData} metricLabel={selectedMetric === 'alcance' ? 'Alcance' : 'Seguidores'} />
        </GraphContainer>
    );
};

export default CrecimientoSection;
