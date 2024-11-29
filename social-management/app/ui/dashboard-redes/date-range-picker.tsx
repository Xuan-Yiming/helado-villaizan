// app/ui/dashboard-redes/date-range-picker.tsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";
import './date-range-picker.css';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useSuccess } from "@/app/context/successContext";
import { useError } from "@/app/context/errorContext";
import { useConfirmation} from "@/app/context/confirmationContext";

interface DateRangePickerProps {
    onDateRangeChange: (startDate: Date, endDate: Date) => void;
    selectedRange?: { start: Date; end: Date } | null;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange, selectedRange }) => {
    const [tempStartDay, setTempStartDay] = useState<string>('');
    const [tempStartMonth, setTempStartMonth] = useState<string>('');
    const [tempStartYear, setTempStartYear] = useState<string>('');

    const [tempEndDay, setTempEndDay] = useState<string>('');
    const [tempEndMonth, setTempEndMonth] = useState<string>('');
    const [tempEndYear, setTempEndYear] = useState<string>('');

    const [showPicker, setShowPicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(selectedRange?.start);
    const [endDate, setEndDate] = useState<Date | undefined>(selectedRange?.end);

    const [tempStartDate, setTempStartDate] = useState<Date | undefined>(selectedRange?.start);
    const [tempEndDate, setTempEndDate] = useState<Date | undefined>(selectedRange?.end);
    const [quickSelect, setQuickSelect] = useState<string>('Definir rango de fechas');
    const [tempQuickSelect, setTempQuickSelect] = useState<string>('Definir rango de fechas');
    const [isCustomDate, setIsCustomDate] = useState(false);

    const { showError } = useError(); // Para mensajes de error
    const { showSuccess } = useSuccess(); // Para mensajes de éxito
    const { showConfirmation, showAlert } = useConfirmation();

    useEffect(() => {
        if (selectedRange) {
            setStartDate(selectedRange.start);
            setEndDate(selectedRange.end);

            // Actualiza el texto de quickSelect dependiendo del rango de fechas
            const today = dayjs().startOf('day');
            const start = dayjs(selectedRange.start);
            const end = dayjs(selectedRange.end);

            if (start.isSame(today.subtract(7, 'day'), 'day') && end.isSame(today.subtract(1, 'day'), 'day')) {
                setQuickSelect(`Últimos 7 días: ${start.format('DD MMM, YYYY')} - ${end.format('DD MMM, YYYY')}`);
            } else if (start.isSame(today.subtract(28, 'day'), 'day') && end.isSame(today.subtract(1, 'day'), 'day')) {
                setQuickSelect(`Últimos 28 días: ${start.format('DD MMM, YYYY')} - ${end.format('DD MMM, YYYY')}`);
            } else if (start.isSame(today.subtract(90, 'day'), 'day') && end.isSame(today.subtract(1, 'day'), 'day')) {
                setQuickSelect(`Últimos 90 días: ${start.format('DD MMM, YYYY')} - ${end.format('DD MMM, YYYY')}`);
            } else if (start.isSame(dayjs().startOf('month'), 'day') && end.isSame(dayjs().subtract(1, 'day'), 'day')) {
                setQuickSelect(`Este mes: ${start.format('DD MMM, YYYY')} - ${end.format('DD MMM, YYYY')}`);
            } else {
                setQuickSelect(`Personalizado: ${start.format('DD MMM, YYYY')} - ${end.format('DD MMM, YYYY')}`);
            }
        } else {
            setQuickSelect('Definir rango de fechas');
        }
    }, [selectedRange]);

    const togglePicker = () => setShowPicker(!showPicker);

    const handleQuickSelect = (label: string, days: number) => {
        const newStartDate = dayjs().subtract(days, 'day').toDate();
        const newEndDate = dayjs().subtract(1, 'day').toDate();
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setTempQuickSelect(label);
        setIsCustomDate(false);
    };

    const handleCustomDate = () => {
        setIsCustomDate(true);
        setTempQuickSelect('Personalizado');
    };

    // Función para formatear el valor de día y mes
    const formatDayOrMonth = (value: string, max: number): string => {
        const cleanValue = value.replace(/\D/g, ''); // Elimina caracteres no numéricos
        if (cleanValue.length === 1 && parseInt(cleanValue) > max / 10) {
            return `0${cleanValue}`; // Agrega un "0" adelante para valores de un dígito mayores a los posibles
        } else if (cleanValue.length === 2) {
            const intValue = parseInt(cleanValue);
            if (intValue > max) return `${max}`; // Asegura que el valor no sobrepase el máximo
        }
        return cleanValue.slice(0, 2); // Limita el valor a 2 dígitos
    };

    // Función para el campo de año
    const formatYear = (value: string): string => {
        const cleanValue = value.replace(/\D/g, ''); // Elimina caracteres no numéricos
        return cleanValue.slice(0, 4); // Limita el valor a 4 dígitos
    };

    const applyChanges = () => {
        if (tempQuickSelect !== 'Personalizado') {
            // Para opciones rápidas (7, 28, 90 días y este mes), no se necesitan validaciones de fecha
            if (tempStartDate && tempEndDate) {
                setStartDate(tempStartDate);
                setEndDate(tempEndDate);
                setQuickSelect(`${tempQuickSelect}: ${dayjs(tempStartDate).format('DD MMM, YYYY')} - ${dayjs(tempEndDate).format('DD MMM, YYYY')}`);
                onDateRangeChange(tempStartDate, tempEndDate);
                setShowPicker(false);
            }
        } else if (tempStartDay && tempStartMonth && tempStartYear && tempEndDay && tempEndMonth && tempEndYear) {
            // Para fechas personalizadas
            const formattedStartDate = `${tempStartYear}-${tempStartMonth}-${tempStartDay}`;
            const formattedEndDate = `${tempEndYear}-${tempEndMonth}-${tempEndDay}`;
    
            const startDate = dayjs(formattedStartDate, 'YYYY-MM-DD', true);
            const endDate = dayjs(formattedEndDate, 'YYYY-MM-DD', true);
            const today = dayjs().startOf('day');
    
            if (!startDate.isValid() || !endDate.isValid()) {
                showAlert("Por favor ingresa fechas válidas.",() => {});
                return;
            }
    
            if (startDate > endDate) {
                showAlert("La fecha de inicio no puede ser posterior a la fecha de fin.",() => {});
                return;
            }
    
            if (parseInt(tempStartYear) < 2021 || parseInt(tempEndYear) < 2021) {
                showAlert("No se permiten años menores a 2021.",() => {});
                return;
            }
    
            if (endDate.isAfter(today) || startDate.isAfter(today)) {
                showAlert("Las fechas no pueden ser futuras.",() => {});
                return;
            }
    
            setTempStartDate(startDate.toDate());
            setTempEndDate(endDate.toDate());
            setStartDate(startDate.toDate());
            setEndDate(endDate.toDate());
    
            setQuickSelect(`Personalizado: ${startDate.format('DD MMM, YYYY')} - ${endDate.format('DD MMM, YYYY')}`);
            onDateRangeChange(startDate.toDate(), endDate.toDate());
            setShowPicker(false);
        } else {
            showAlert("Por favor completa todos los campos de fecha.",() => {});
        }
    };
    

    const cancelChanges = () => {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setTempQuickSelect(quickSelect);
        setIsCustomDate(false);
        setShowPicker(false);
    };

    return (
        <div className="relative inline-block h-full">
            <div className="h-16 flex items-center border rounded border-gray-300">
                <button onClick={togglePicker} className="flex justify-between items-center w-full px-3 py-3">
                    <span>{quickSelect}</span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-700" />
                </button>
            </div>

            {showPicker && (
                <div className="absolute z-10 mt-2 p-4 bg-white border rounded shadow-lg custom-picker flex flex-col" style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                    <div className="flex flex-col gap-2 quick-select mb-4">
                        <button className={`quick-select-button ${tempQuickSelect === 'Últimos 7 días' ? 'active' : ''}`} onClick={() => handleQuickSelect('Últimos 7 días', 7)}>
                            Últimos 7 días
                        </button>
                        <button className={`quick-select-button ${tempQuickSelect === 'Últimos 28 días' ? 'active' : ''}`} onClick={() => handleQuickSelect('Últimos 28 días', 28)}>
                            Últimos 28 días
                        </button>
                        <button className={`quick-select-button ${tempQuickSelect === 'Últimos 90 días' ? 'active' : ''}`} onClick={() => handleQuickSelect('Últimos 90 días', 90)}>
                            Últimos 90 días
                        </button>
                        <button className={`quick-select-button ${tempQuickSelect === 'Este mes' ? 'active' : ''}`} onClick={() => handleQuickSelect('Este mes', dayjs().date() - 1)}>
                            Este mes
                        </button>
                        <button className={`quick-select-button ${tempQuickSelect === 'Personalizado' ? 'active' : ''}`} onClick={handleCustomDate}>
                            Personalizado
                        </button>
                    </div>

                    {!isCustomDate ? (
                        <DatePicker
                            selected={tempStartDate ?? undefined}
                            onChange={(dates: [Date | null, Date | null]) => {
                                const [start, end] = dates;
                                if (start && end) {
                                    setTempStartDate(start);
                                    setTempEndDate(end);
                                }
                            }}
                            startDate={tempStartDate ?? undefined}
                            endDate={tempEndDate ?? undefined}
                            selectsRange
                            inline
                        />
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    placeholder="DD"
                                    value={tempStartDay}
                                    onChange={(e) => setTempStartDay(formatDayOrMonth(e.target.value, 31))}
                                    maxLength={2}
                                    className="border p-2 rounded w-12"
                                />
                                <input
                                    type="text"
                                    placeholder="MM"
                                    value={tempStartMonth}
                                    onChange={(e) => setTempStartMonth(formatDayOrMonth(e.target.value, 12))}
                                    maxLength={2}
                                    className="border p-2 rounded w-12"
                                />
                                <input
                                    type="text"
                                    placeholder="YYYY"
                                    value={tempStartYear}
                                    onChange={(e) => setTempStartYear(formatYear(e.target.value))}
                                    maxLength={4}
                                    className="border p-2 rounded w-16"
                                />
                            </div>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    placeholder="DD"
                                    value={tempEndDay}
                                    onChange={(e) => setTempEndDay(formatDayOrMonth(e.target.value, 31))}
                                    maxLength={2}
                                    className="border p-2 rounded w-12"
                                />
                                <input
                                    type="text"
                                    placeholder="MM"
                                    value={tempEndMonth}
                                    onChange={(e) => setTempEndMonth(formatDayOrMonth(e.target.value, 12))}
                                    maxLength={2}
                                    className="border p-2 rounded w-12"
                                />
                                <input
                                    type="text"
                                    placeholder="YYYY"
                                    value={tempEndYear}
                                    onChange={(e) => setTempEndYear(formatYear(e.target.value))}
                                    maxLength={4}
                                    className="border p-2 rounded w-16"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-4">
                        <button onClick={cancelChanges} className="text-gray-600 hover:text-gray-800">Cancelar</button>
                        <button onClick={applyChanges} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Actualizar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
