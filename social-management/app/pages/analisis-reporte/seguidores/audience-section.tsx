"use client";
import React, { useEffect, useState } from 'react';
import GraphContainer from '@/app/ui/dashboard-redes/graph-container';
import AgeGenderChartComponent from '@/app/ui/dashboard-redes/age-gender-chart-component';
import CountryChartComponent from '@/app/ui/dashboard-redes/country-chart-component';
import { ChartData } from '@/app/lib/types';

interface AudienceSectionProps {
    appliedDateRange: { start: Date; end: Date } | null;
    network: string;
}

const AudienceSection: React.FC<AudienceSectionProps> = ({ appliedDateRange, network }) => {
    const [ageGenderData, setAgeGenderData] = useState<ChartData[]>([]);
    const [countryData, setCountryData] = useState<ChartData[]>([]);
    const [cachedData, setCachedData] = useState<{ [key: string]: { ageGender: ChartData[], country: ChartData[] } }>({});

    useEffect(() => {
        if (appliedDateRange) {
            const cacheKey = `${network}-${appliedDateRange.start.toISOString()}-${appliedDateRange.end.toISOString()}`;
            
            // Verifica si los datos están en caché
            if (cachedData[cacheKey]) {
                setAgeGenderData(cachedData[cacheKey].ageGender);
                setCountryData(cachedData[cacheKey].country);
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
            // Fetch para edad y género
            const ageGenderResponse = await fetch(`/api/${network}/metricas/audiencia/seguidores?startDate=${startDate}&endDate=${endDate}`);
            const ageGender = await ageGenderResponse.json();

            // Fetch para países
            const countryResponse = await fetch(`/api/${network}/metricas/audiencia/geografico?startDate=${startDate}&endDate=${endDate}`);
            const country = await countryResponse.json();

            // Guarda los datos en caché y establece el estado
            setCachedData(prevCache => ({ ...prevCache, [cacheKey]: { ageGender, country } }));
            setAgeGenderData(ageGender);
            setCountryData(country);
        } catch (error) {
            console.error("Error fetching audience data:", error);
        }
    };

    return (
        <div className="flex gap-8 mt-8"> {/* Cambia gap-4 a gap-8 para una separación mayor */}
            <GraphContainer title="Edad y Sexo" className="w-1/2">
                <AgeGenderChartComponent data={ageGenderData} />
            </GraphContainer>
            <GraphContainer title="Países Principales" className="w-1/2">
                <CountryChartComponent data={countryData} />
            </GraphContainer>
        </div>
    );
};

export default AudienceSection;
