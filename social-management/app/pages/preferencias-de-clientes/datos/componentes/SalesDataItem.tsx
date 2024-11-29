"use client";
import React, { useState } from "react";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { useError } from "@/app/context/errorContext";
import { useSuccess } from "@/app/context/successContext";

// Registrar el idioma español para DatePicker
import { es } from "date-fns/locale";
registerLocale("es", es);

const SalesDataItem = () => {
  const { showError } = useError();
  const { showSuccess } = useSuccess();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const currentDate = new Date(); // Fecha actual para limitar el rango permitido

  // Formatear fechas en formato ISO para usarlas en la URL
  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDate);

  // Validar fechas al cambiar
  const validateDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        showError(
          "El rango de fechas no es válido: la fecha de inicio no puede ser posterior a la fecha de fin."
        );
        return false;
      } else if (end > currentDate) {
        showError(
          "La fecha de fin no puede ser posterior al día actual."
        );
        return false;
      } else if (start > currentDate) {
        showError(
          "La fecha de inicio no puede ser posterior al día actual."
        );
        return false;
      }
      showSuccess("El rango de fechas es válido.");
      return true;
    } else {
      showError("Por favor selecciona ambas fechas.");
      return false;
    }
  };

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
                maxDate={currentDate} // Limitar hasta el día actual
                className="border rounded p-1"
                onBlur={validateDates} // Validar fechas al salir del campo
              />
              <span>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd 'de' MMMM 'de' yyyy"
                locale="es"
                maxDate={currentDate} // Limitar hasta el día actual
                className="border rounded p-1"
                onBlur={validateDates} // Validar fechas al salir del campo
              />
            </div>
          </div>
          <p className="text-gray-600 mt-2">Data procesada</p>
        </div>
      </div>

      <div>
        {startDate && endDate && validateDates() ? (
          <Link
            href={`/pages/preferencias-de-clientes/datos/dashboard?startDate=${startDateFormatted}&endDate=${endDateFormatted}`}
          >
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