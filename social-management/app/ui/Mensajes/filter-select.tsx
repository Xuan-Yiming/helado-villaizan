import React from 'react';

interface FilterSelectProps {
    label: string;
    id: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, id, options, value, onChange }) => {
    return (
        <div className="flex-1 border rounded border-gray-300 h-15 mx-1 p-2">
            <h3 className="font-bold">{label}</h3>
            <label htmlFor={id} className="sr-only">Filter by {label.toLowerCase()}</label>
            <select
                id={id}
                className="w-full bg-[#DFE3E3] border-none outline-none text-gray-600 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterSelect;