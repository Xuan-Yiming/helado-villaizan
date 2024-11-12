// pages/analisis-reporte/analisis-redes/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import DateRangePicker from '@/app/ui/dashboard-redes/date-range-picker';

const MetricsPage = () => {
    const [network, setNetwork] = useState<'facebook' | 'instagram'>('facebook');
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);

    useEffect(() => {
        // Establece la fecha inicial en el cliente
        setDateRange({
            start: new Date(),
            end: new Date()
        });
    }, []);

    const handleNetworkChange = (selectedNetwork: 'facebook' | 'instagram') => {
        setNetwork(selectedNetwork);
    };

    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setDateRange({ start: startDate, end: endDate });
    };

    if (!dateRange) return null; // Evita renderizar hasta que dateRange esté inicializado

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Análisis de Métricas</h1>

            {/* Selector de Red Social y Rango de Fechas */}
            <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
            />

            <div className="mt-8">
                <p>Red Social Seleccionada: {network}</p>
                <p>Rango de Fechas: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}</p>
                {/* Aquí puedes integrar los gráficos correspondientes */}
            </div>
        </div>
    );
};

export default MetricsPage;
