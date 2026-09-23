import React, { useState } from "react";

const CheckboxGroup = ({
  options = [], // [{label: "React", value: "react"}, ...]
  defaultValues = [],
  required = false,
  className = "",
  error = "",
}) => {
  const [selected, setSelected] = useState(defaultValues);

  const handleCheck = (value) => {
    let updatedSelection;
    if (selected.includes(value)) {
      updatedSelection = selected.filter((item) => item !== value);
    } else {
      updatedSelection = [...selected, value];
    }
    setSelected(updatedSelection);
    console.log("Selected checkboxes:", updatedSelection);
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={option.value}
            checked={selected.includes(option.value)}
            onChange={() => handleCheck(option.value)}
            required={required && selected.length === 0}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}

      {error && required && selected.length === 0 && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default CheckboxGroup;
