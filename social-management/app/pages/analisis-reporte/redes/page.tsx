"use client";
import React, { useState, useEffect, useRef } from "react";
import DateRangePicker from "@/app/ui/dashboard-redes/date-range-picker";
import FilterSelect from "@/app/ui/interacciones/filter-select";
import { AdjustmentsHorizontalIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import SelectedFiltersDisplay from "@/app/ui/dashboard-redes/selected-filters-display";
import CrecimientoSection from "./crecimiento-section";
import AudienceSection from "./audience-section";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSuccess } from "@/app/context/successContext";
import { useError } from "@/app/context/errorContext";
import { useConfirmation} from "@/app/context/confirmationContext";

const MetricsPage = () => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [network, setNetwork] = useState<'facebook' | 'instagram'>("facebook");
    const [appliedNetwork, setAppliedNetwork] = useState<'facebook' | 'instagram'>("facebook");
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const [appliedDateRange, setAppliedDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false); // Añade el estado de loading
    const { showError } = useError(); // Para mensajes de error
    const { showSuccess } = useSuccess(); // Para mensajes de éxito
    const { showConfirmation, showAlert } = useConfirmation();

    useEffect(() => {
        setNetwork("facebook");
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setNetwork("facebook");
        setDateRange(null);
        setAppliedDateRange(null);
        setAppliedNetwork("facebook");
    };

    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setDateRange({ start: startDate, end: endDate });
    };

    const handleNetworkChange = (value: string) => {
        if (value === "facebook" || value === "instagram") {
            setNetwork(value);
        }
    };

    const handleAplicarFiltro = () => {
        if (!dateRange) {
            showAlert("Por favor selecciona un rango de fechas antes de aplicar el filtro.",() => {});
            return;
        }
        setLoading(true); // Activa el estado de carga
        setAppliedDateRange(dateRange);
        setAppliedNetwork(network);
    
        // Simula un breve retraso para reiniciar el estado de carga (puedes ajustarlo según la lógica de tu API)
        setTimeout(() => setLoading(false), 500); // Cambia 500 por el tiempo estimado de carga
    };

    const exportToPDF = async () => {
        if (reportRef.current) {
            // Establece un ancho fijo para asegurar que html2canvas renderice correctamente
            const originalWidth = reportRef.current.style.width;
            reportRef.current.style.width = "1200px"; // Ajusta según el ancho que necesitas
    
            // Genera el canvas con html2canvas
            const canvas = await html2canvas(reportRef.current, {
                scale: 3, // Mejora la calidad del renderizado
                useCORS: true, // Habilita imágenes externas
                allowTaint: true, // Permite el renderizado de contenido cruzado
                windowWidth: 1200, // Simula el ancho del navegador
            });
    
            // Restaura el ancho original después de generar el canvas
            reportRef.current.style.width = originalWidth;
    
            // Obtén los datos de la imagen del canvas
            const imgData = canvas.toDataURL("image/png");
    
            // Configura el PDF según el tamaño del canvas generado
            const pdfWidth = 210; // Ancho A4 en mm
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Ajusta la altura proporcionalmente
    
            const pdf = new jsPDF("p", "mm", "a4");
    
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
            // Guarda el archivo PDF
            pdf.save(`Reporte_${appliedNetwork}_${new Date().toISOString().split("T")[0]}.pdf`);
        } else {
            showAlert("El contenido no está disponible para exportar.",() => {});
        }
    };
    

    return (
        <div className="container mx-auto p-4 text-black">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Análisis de redes</h1>
                <button
                    onClick={toggleFilters}
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? "bg-black text-white" : "border border-black bg-transparent text-black"}`}
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
                            { value: "facebook", label: "Facebook" },
                            { value: "instagram", label: "Instagram" },
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

            {/* Report Section */}
            {appliedDateRange && (
                <div ref={reportRef}>
                    {/* Selected Filters Display */}
                    <SelectedFiltersDisplay appliedNetwork={appliedNetwork} appliedDateRange={appliedDateRange} />

                    <div className="mt-8">
                        {loading ? (
                            <div className="flex justify-center items-center h-48 text-gray-500">Cargando datos...</div>
                        ) : (
                            <AudienceSection appliedDateRange={appliedDateRange} network={appliedNetwork} />
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {loading ? (
                            <div className="flex justify-center items-center col-span-2 h-48 text-gray-500">Cargando gráficos...</div>
                        ) : (
                            <>
                                <CrecimientoSection metric="alcance" appliedDateRange={appliedDateRange} network={appliedNetwork} />
                                <CrecimientoSection metric="engagement" appliedDateRange={appliedDateRange} network={appliedNetwork} />
                                <CrecimientoSection metric="seguidores" appliedDateRange={appliedDateRange} network={appliedNetwork} />
                                <CrecimientoSection metric="visitas" appliedDateRange={appliedDateRange} network={appliedNetwork} />
                            </>
                        )}
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
        </div>
    );
};

export default MetricsPage;
