// ui/date-range-picker.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";
import './date-range-picker.css';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface DateRangePickerProps {
    onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [startDate, setStartDate] = useState<Date>(dayjs().subtract(28, 'day').toDate());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [tempStartDate, setTempStartDate] = useState<Date>(startDate);
    const [tempEndDate, setTempEndDate] = useState<Date>(endDate);
    const [quickSelect, setQuickSelect] = useState<string>('Últimos 28 días');
    const [tempQuickSelect, setTempQuickSelect] = useState<string>('Últimos 28 días');
    const [isCustomDate, setIsCustomDate] = useState(false);

    const togglePicker = () => setShowPicker(!showPicker);

    const handleQuickSelect = (label: string, days: number) => {
        const newStartDate = dayjs().subtract(days, 'day').toDate();
        const newEndDate = new Date();
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setTempQuickSelect(label);
        setIsCustomDate(false); // Oculta los cuadros de fecha personalizada al seleccionar un rango rápido
    };

    const handleCustomDate = () => {
        setIsCustomDate(true);
        setTempQuickSelect('Personalizado');
    };

    const formatDateInput = (value: string): string => {
        // Solo permite dígitos y formatea la fecha automáticamente
        const digits = value.replace(/\D/g, '');
        const day = digits.slice(0, 2);
        const month = digits.slice(2, 4);
        const year = digits.slice(4, 8);
        let formatted = day;
        if (month) formatted += `/${month}`;
        if (year) formatted += `/${year}`;
        return formatted;
    };

    const handleStartDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatDateInput(e.target.value);
        e.target.value = formattedValue;

        if (formattedValue.length === 10) {
            const date = dayjs(formattedValue, 'DD/MM/YYYY', true);
            if (date.isValid()) setTempStartDate(date.toDate());
        }
    };

    const handleEndDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatDateInput(e.target.value);
        e.target.value = formattedValue;

        if (formattedValue.length === 10) {
            const date = dayjs(formattedValue, 'DD/MM/YYYY', true);
            if (date.isValid()) setTempEndDate(date.toDate());
        }
    };

    const applyChanges = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setQuickSelect(tempQuickSelect);
        onDateRangeChange(tempStartDate, tempEndDate);
        setShowPicker(false);
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
                    <span>{quickSelect}: {dayjs(startDate).format('DD MMM, YYYY')} - {dayjs(endDate).format('DD MMM, YYYY')}</span>
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
                            selected={tempStartDate}
                            onChange={(dates: [Date | null, Date | null]) => {
                                const [start, end] = dates;
                                if (start && end) {
                                    setTempStartDate(start);
                                    setTempEndDate(end);
                                    setTempQuickSelect('Personalizado');
                                }
                            }}
                            startDate={tempStartDate}
                            endDate={tempEndDate}
                            selectsRange
                            inline
                        />
                    ) : (
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Inicio (dd/mm/yyyy)"
                                defaultValue={dayjs(tempStartDate).format('DD/MM/YYYY')}
                                onChange={handleStartDateInput}
                                maxLength={10}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Fin (dd/mm/yyyy)"
                                defaultValue={dayjs(tempEndDate).format('DD/MM/YYYY')}
                                onChange={handleEndDateInput}
                                maxLength={10}
                                className="border p-2 rounded"
                            />
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
