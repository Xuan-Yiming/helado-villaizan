"use client";
import React, { useState, useEffect } from 'react';
import GraphContainer from '@/app/ui/dashboard-redes/graph-container';
import LineChartComponent from '@/app/ui/dashboard-redes/line-chart-component';
import { ChartData } from '@/app/lib/types';

interface CrecimientoSectionProps {
    metric: 'alcance' | 'engagement' | 'seguidores' | 'visitas';
    appliedDateRange: { start: Date; end: Date } | null;
    network: string;
}

const CrecimientoSection: React.FC<CrecimientoSectionProps> = ({ metric, appliedDateRange, network }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [title, setTitle] = useState<string>('');
    const [cachedData, setCachedData] = useState<{ [key: string]: ChartData[] }>({});

    useEffect(() => {
        if (appliedDateRange) {
            const cacheKey = `${network}-${metric}-${appliedDateRange.start.toISOString()}-${appliedDateRange.end.toISOString()}`;
            
            // Si ya tenemos los datos en caché, no hacemos la llamada a la API
            if (cachedData[cacheKey]) {
                setChartData(cachedData[cacheKey]);
                setTitle(getDynamicTitle(metric, network));
            } else {
                fetchChartData(metric, cacheKey);
            }
        }
    }, [metric, appliedDateRange, network]);

    const fetchChartData = async (metric: 'alcance' | 'engagement' | 'seguidores' | 'visitas', cacheKey: string) => {
        if (!appliedDateRange) return;

        const startDate = appliedDateRange.start.toISOString();
        const endDate = appliedDateRange.end.toISOString();

        try {
            // Usa `network` dinámicamente para construir el endpoint
            const response = await fetch(`/api/${network}/metricas/crecimiento/${metric}?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();

            const formattedData = data.map((item: any) => ({
                name: item.name,
                value: item.value,
            }));

            // Guardamos los datos en el estado de caché
            setCachedData(prevCache => ({ ...prevCache, [cacheKey]: formattedData }));
            setChartData(formattedData);
            setTitle(getDynamicTitle(metric, network));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getDynamicTitle = (metric: string, network: string) => {
        if (network === 'instagram') {
            if (metric === 'engagement') {
                return 'Impresiones de la página'; // Cambio para engagement en Instagram
            } else if (metric === 'seguidores') {
                return 'Nuevos seguidores de la página (máximo los últimos 30 días)'; // Cambio para seguidores en Instagram
            }
        }
        return `${capitalizeMetric(metric)} de la página`; // Título genérico
    };

    const capitalizeMetric = (metric: string) => {
        return metric.charAt(0).toUpperCase() + metric.slice(1);
    };

    return (
        <GraphContainer title={title}>
            <LineChartComponent data={chartData} metricLabel={capitalizeMetric(metric)} />
        </GraphContainer>
    );
};

export default CrecimientoSection;
