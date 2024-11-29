"use client";
import React, { useEffect, useState } from 'react';
import GraphContainer from '@/app/ui/dashboard-redes/graph-container';
import HorizontalBarChartComponent from '@/app/ui/dashboard-redes/horizontal-bar-chart-component';
import { ChartData } from '@/app/lib/types';

interface AudienceSectionProps {
    appliedDateRange: { start: Date; end: Date } | null;
    network: string;
}

const AudienceSection: React.FC<AudienceSectionProps> = ({ appliedDateRange, network }) => {
    const [countryData, setCountryData] = useState<ChartData[]>([]);
    const [cityData, setCityData] = useState<ChartData[]>([]);
    const [impressionData, setImpressionData] = useState<ChartData[]>([]);
    const [cachedData, setCachedData] = useState<{
        [key: string]: { country: ChartData[], city: ChartData[], impression: ChartData[] }
    }>({});

    useEffect(() => {
        if (appliedDateRange) {
            const cacheKey = `${network}-${appliedDateRange.start.toISOString()}-${appliedDateRange.end.toISOString()}`;
            
            // Verifica si los datos están en caché
            if (cachedData[cacheKey]) {
                setCountryData(cachedData[cacheKey].country);
                setCityData(cachedData[cacheKey].city);
                setImpressionData(cachedData[cacheKey].impression);
            } else {
                fetchAudienceData(cacheKey);
            }
        }
    }, [appliedDateRange, network]);

    const fetchAudienceData = async (cacheKey: string) => {
        if (!appliedDateRange) return;

        const startDate = appliedDateRange.start.toISOString();
        const endDate = appliedDateRange.end.toISOString();

        try {
            // Fetch para países
            const countryResponse = await fetch(`/api/${network}/metricas/audiencia/paises?startDate=${startDate}&endDate=${endDate}`);
            const country = await countryResponse.json();

            // Fetch para ciudades
            const cityResponse = await fetch(`/api/${network}/metricas/audiencia/ciudades?startDate=${startDate}&endDate=${endDate}`);
            const city = await cityResponse.json();

            // Fetch para impresiones
            const impressionResponse = await fetch(`/api/${network}/metricas/audiencia/impresiones?startDate=${startDate}&endDate=${endDate}`);
            const impression = await impressionResponse.json();

            // Verifica si los datos están en el formato correcto
            if (!Array.isArray(country) || !Array.isArray(city) || !Array.isArray(impression)) {
                throw new Error("Formato de datos inválido.");
            }

            // Guarda los datos en caché y establece el estado
            setCachedData(prevCache => ({ ...prevCache, [cacheKey]: { country, city, impression } }));
            setCountryData(country);
            setCityData(city);
            setImpressionData(impression);
        } catch (error) {
            console.error("Error fetching audience data:", error);
        }
    };

    // Filtra "Veces en que las publicaciones aparecieron en pantalla" y obtén los datos restantes
    const screenAppearanceData = impressionData.find(item => item.name === "Veces en que las publicaciones aparecieron en pantalla");
    const filteredImpressionData = impressionData.filter(item => item.name !== "Veces en que las publicaciones aparecieron en pantalla");

    return (
        <div className="flex flex-col gap-8 mt-8">
            <div className="flex gap-8">
                <div className="w-1/2 flex flex-col gap-8">
                    <GraphContainer title="Países principales de seguidores (histórico)" className="w-full h-1/2">
                        <HorizontalBarChartComponent data={countryData} />
                    </GraphContainer>
                    <GraphContainer
                        title={network === "instagram" ? "Interacciones en la página (máximo los últimos 30 días)" : "Fuentes de impresiones de publicaciones"}
                        className="w-full h-1/2"
                    >
                        {/* Muestra el subtítulo para "Veces en que las publicaciones aparecieron en pantalla" */}
                        {screenAppearanceData && (
                            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                                {screenAppearanceData.name}: {screenAppearanceData.value}
                            </div>
                        )}
                        {/* Pasa solo los datos filtrados al componente HorizontalBarChartComponent */}
                        <HorizontalBarChartComponent data={filteredImpressionData} />
                    </GraphContainer>
                </div>
                <GraphContainer title="Ciudades principales de seguidores (histórico)" className="w-1/2">
                    <HorizontalBarChartComponent data={cityData} />
                </GraphContainer>
            </div>
        </div>
    );
};

export default AudienceSection;
