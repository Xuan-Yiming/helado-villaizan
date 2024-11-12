// app/pages/analisis-reporte/seguidores/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import DateRangePicker from '@/app/ui/dashboard-redes/date-range-picker';
import FilterSelect from '@/app/ui/interacciones/filter-select';
import { AdjustmentsHorizontalIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const MetricsPage = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [network, setNetwork] = useState<'facebook' | 'instagram'>('facebook');
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const [isClient, setIsClient] = useState(false); // Nueva variable para verificar si estamos en el cliente

    useEffect(() => {
        setIsClient(true); // Marca que estamos en el cliente
        setDateRange({
            start: new Date(),
            end: new Date()
        });
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setNetwork('facebook');
        setDateRange({
            start: new Date(),
            end: new Date()
        });
    };

    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setDateRange({ start: startDate, end: endDate });
    };

    const handleNetworkChange = (value: string) => {
        if (value === 'facebook' || value === 'instagram') {
            setNetwork(value);
        }
    };

    const handleAplicarFiltro = () => {
        console.log("Red Social Seleccionada:", network);
        console.log("Rango de Fechas:", dateRange?.start, "-", dateRange?.end);
    };

    if (!isClient || !dateRange) return null; // Evita renderizar hasta que estemos en el cliente y dateRange esté inicializado

    return (
        <div className="container mx-auto p-4 text-black">
            {/* Header */}
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

            {/* Filters */}
            {filtersVisible && (
                <div className="flex justify-between mt-4">
                    <FilterSelect
                        label="Red Social"
                        id="social-network-filter"
                        options={[
                            { value: 'facebook', label: 'Facebook' },
                            { value: 'instagram', label: 'Instagram' },
                        ]}
                        value={network}
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

            {/* Result section */}
            <div className="mt-8">
                <p>Red Social Seleccionada: {network}</p>
                <p>Rango de Fechas: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}</p>
                {/* Aquí puedes integrar los gráficos correspondientes */}
            </div>
        </div>
    );
};

export default MetricsPage;
