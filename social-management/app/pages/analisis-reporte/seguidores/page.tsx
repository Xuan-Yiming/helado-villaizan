// app/pages/analisis-reporte/seguidores/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import DateRangePicker from '@/app/ui/dashboard-redes/date-range-picker';
import FilterSelect from '@/app/ui/interacciones/filter-select';
import { AdjustmentsHorizontalIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import SelectedFiltersDisplay from '@/app/ui/dashboard-redes/selected-filters-display';

const MetricsPage = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [network, setNetwork] = useState<'facebook' | 'instagram'>('facebook');
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const [isClient, setIsClient] = useState(false);

    const [tempNetwork, setTempNetwork] = useState<'facebook' | 'instagram'>('facebook');
    const [tempDateRange, setTempDateRange] = useState<{ start: Date; end: Date } | null>(null);

    useEffect(() => {
        setIsClient(true);
        const initialDate = { start: new Date(), end: new Date() };
        setDateRange(initialDate);
        setTempDateRange(initialDate);
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setTempNetwork('facebook');
        setTempDateRange({ start: new Date(), end: new Date() });
    };

    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setTempDateRange({ start: startDate, end: endDate });
    };

    const handleNetworkChange = (value: string) => {
        if (value === 'facebook' || value === 'instagram') {
            setTempNetwork(value);
        }
    };

    const handleAplicarFiltro = () => {
        setNetwork(tempNetwork);
        if (tempDateRange) {
            setDateRange(tempDateRange);
        }
    };

    if (!isClient || !dateRange) return null;

    return (
        <div className="container mx-auto p-4 text-black">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Análisis de redes</h1>

                <button
                    onClick={toggleFilters}
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'
                        }`}
                >
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                    <div>Filtros</div>
                </button>
            </div>

            {filtersVisible && (
                <div className="flex justify-between mt-4">
                    <FilterSelect
                        label="Red Social"
                        id="social-network-filter"
                        options={[
                            { value: 'facebook', label: 'Facebook' },
                            { value: 'instagram', label: 'Instagram' },
                        ]}
                        value={tempNetwork}
                        onChange={handleNetworkChange}
                    />

                    <DateRangePicker
                        onDateRangeChange={handleDateRangeChange}
                    />

                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black border-none"
                            onClick={resetFilters}
                        >
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            <div>Limpiar Todo</div>
                        </button>
                    </div>
                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 border-none"
                            onClick={handleAplicarFiltro}
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>Aplicar filtro</div>
                        </button>
                    </div>
                </div>
            )}

            {/* Bloque de Resultados */}
            {dateRange && (
                <SelectedFiltersDisplay 
                    network={network} 
                    dateRange={dateRange} 
                />
            )}

            {/* Aquí puedes integrar los gráficos correspondientes */}
        </div>
    );
};

export default MetricsPage;
