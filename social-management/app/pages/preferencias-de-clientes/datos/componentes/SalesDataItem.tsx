"use client";
import React, { useState } from 'react';
import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';

// Registrar el idioma español para DatePicker (descomentarlo si deseas activar el idioma español)
import { es } from 'date-fns/locale';
registerLocale('es', es);
// Registrar el idioma español para DatePicker
//registerLocale('es', es);

const SalesDataItem = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const isDateSelected = startDate !== null && endDate !== null;

    // Formatear fechas en formato ISO para que se usen en la URL
    const formatDate = (date: Date | null) => date ? date.toISOString().split('T')[0] : '';

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    return (
        <div className="bg-gray-200 rounded-lg p-4 flex items-start justify-between w-full mx-auto mt-4 hover:bg-gray-300 cursor-pointer">
            <div className="flex justify-start w-full">
                <div className="bg-gray-500 rounded-full h-10 w-10"></div> {/* Icono circular */}
                <div className="ml-4 flex flex-col">
                    <div className="flex items-center space-x-4">
                        <p className="font-bold text-lg">Procesamiento de Datos de Ventas</p>
                        <div className="flex items-center space-x-2">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd 'de' MMMM 'de' yyyy"
                                locale="es"
                                className="border rounded p-1"
                            />
                            <span>-</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="dd 'de' MMMM 'de' yyyy"
                                locale="es"
                                className="border rounded p-1"
                            />
                        </div>
                    </div>
                    <p className="text-gray-600 mt-2">Data procesada</p>
                </div>
            </div>

            <div>
                {isDateSelected ? (
                    <Link href={`/pages/preferencias-de-clientes/datos/dashboard?startDate=${startDateFormatted}&endDate=${endDateFormatted}`}>
                        <ArchiveBoxArrowDownIcon className="h-6 w-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
                    </Link>
                ) : (
                    <ArchiveBoxArrowDownIcon className="h-6 w-6 text-gray-400 cursor-not-allowed" />
                )}
            </div>
        </div>
    );
};

export default SalesDataItem;
