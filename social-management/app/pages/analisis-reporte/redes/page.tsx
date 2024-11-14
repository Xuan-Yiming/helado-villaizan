"use client";
import React, { useState, useEffect, useRef } from 'react';
import DateRangePicker from '@/app/ui/dashboard-redes/date-range-picker';
import FilterSelect from '@/app/ui/interacciones/filter-select';
import { AdjustmentsHorizontalIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import FacebookLogo from '@/app/ui/icons/facebook';
import InstagramLogo from '@/app/ui/icons/instagram';
import CrecimientoSection from './crecimiento-section';
import AudienceSection from './audience-section';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const getSocialIcon = (socialNetwork?: string) => {
    if (!socialNetwork) return null;
    switch (socialNetwork.toLowerCase()) {
        case 'facebook':
            return <span className="w-5 h-5 mr-2"><FacebookLogo /></span>;
        case 'instagram':
            return <span className="w-5 h-5 mr-2"><InstagramLogo /></span>;
        default:
            return null;
    }
};

const MetricsPage = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [network, setNetwork] = useState<'facebook' | 'instagram'>('facebook');
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [appliedDateRange, setAppliedDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setNetwork('facebook');
        setDateRange(null);
        setAppliedDateRange(null);
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
        if (!dateRange) {
            alert('Por favor selecciona un rango de fechas antes de aplicar el filtro.');
            return;
        }
        setAppliedDateRange(dateRange);
    };

    const exportToPDF = async () => {
        if (reportRef.current) {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', [canvas.width * 0.264583, canvas.height * 0.264583]); // Ajusta el tamaño del PDF al contenido
    
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.264583, canvas.height * 0.264583);
            pdf.save(`Reporte_${network}_${new Date().toISOString().split('T')[0]}.pdf`);
        }
    };
    

    if (!isClient) return null;

    const capitalizedNetwork = network.charAt(0).toUpperCase() + network.slice(1);

    return (
        <div className="container mx-auto p-4 text-black">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Análisis de redes</h1>
                <button
                    onClick={toggleFilters}
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'}`}
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
                    <DateRangePicker onDateRangeChange={handleDateRangeChange} selectedRange={dateRange} />
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

            {/* Botón Exportar Reporte */}
            {appliedDateRange && (
                <div className="flex justify-start mt-4">
                    <button
                        onClick={exportToPDF}
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                    >
                        Exportar Reporte
                    </button>
                </div>
            )}

            {/* Report Section */}
            {appliedDateRange && (
                <div ref={reportRef}>
                    {/* Filter Summary */}
                    <div className="bg-gray-200 rounded-lg p-4 mb-6 mt-8">
                        <div className="flex items-center">
                            {getSocialIcon(network)}
                            <h2 className="font-bold text-lg">Red Social Seleccionada: {capitalizedNetwork}</h2>
                        </div>
                        <p className="text-gray-600 mt-2">
                            Rango de Fechas: {appliedDateRange ? `${appliedDateRange.start.toLocaleDateString()} - ${appliedDateRange.end.toLocaleDateString()}` : 'No aplicado'}
                        </p>
                    </div>

                    {/* Audience Section */}
                    <div className="mt-8">
                        <AudienceSection appliedDateRange={appliedDateRange} network={network} />
                    </div>

                    {/* Crecimiento Section con las 4 métricas */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CrecimientoSection metric="alcance" appliedDateRange={appliedDateRange} network={network} />
                        <CrecimientoSection metric="engagement" appliedDateRange={appliedDateRange} network={network} />
                        <CrecimientoSection metric="seguidores" appliedDateRange={appliedDateRange} network={network} />
                        <CrecimientoSection metric="visitas" appliedDateRange={appliedDateRange} network={network} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricsPage;