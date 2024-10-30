import React from "react";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  required = false,
  options = [],
}) => {
  return (
    <div className="mb-4 max-w-md">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === "select" ? (
        <select
          title={label}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          title={label}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;