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
    const [cityData, setCityData] = useState<ChartData[]>([]); // Nuevo estado para ciudades
    const [cachedData, setCachedData] = useState<{ [key: string]: { ageGender: ChartData[], country: ChartData[], city: ChartData[] } }>({});

    useEffect(() => {
        if (appliedDateRange) {
            const cacheKey = `${network}-${appliedDateRange.start.toISOString()}-${appliedDateRange.end.toISOString()}`;
            
            // Verifica si los datos están en caché
            if (cachedData[cacheKey]) {
                setAgeGenderData(cachedData[cacheKey].ageGender);
                setCountryData(cachedData[cacheKey].country);
                setCityData(cachedData[cacheKey].city);
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
            // Comentado: Fetch para edad y género
            const ageGenderResponse = await fetch(`/api/${network}/metricas/audiencia/seguidores?startDate=${startDate}&endDate=${endDate}`);
            const ageGender = await ageGenderResponse.json();

            // Fetch para países
            const countryResponse = await fetch(`/api/${network}/metricas/audiencia/paises?startDate=${startDate}&endDate=${endDate}`);
            const country = await countryResponse.json();

            // Fetch para ciudades
            const cityResponse = await fetch(`/api/${network}/metricas/audiencia/ciudades?startDate=${startDate}&endDate=${endDate}`);
            const city = await cityResponse.json();

            // Guarda los datos en caché y establece el estado solo para "paises"
            setCachedData(prevCache => ({ ...prevCache, [cacheKey]: { ageGender: [], country, city: [] } }));
            setCountryData(country);
            
            setAgeGenderData(ageGender);
            setCityData(city);
        } catch (error) {
            console.error("Error fetching audience data:", error);
        }
    };

    return (
        <div className="flex flex-col gap-8 mt-8">
            <div className="flex gap-8">
                <GraphContainer title="Edad y Sexo de Audiencia" className="w-1/2">
                    <AgeGenderChartComponent data={ageGenderData} />
                </GraphContainer>
                <div className="w-1/2 flex flex-col gap-8">
                    <GraphContainer title="Países principales de Audiencia" className="w-full h-2/6">
                        <CountryChartComponent data={countryData} />
                    </GraphContainer>
                    <GraphContainer title="Ciudades principales de Audiencia" className="w-full h-4/5">
                        <CountryChartComponent data={cityData} /> {/* Reutilizando el componente para ciudades */}
                    </GraphContainer>
                </div>
            </div>
        </div>
    );
};

export default AudienceSection;
