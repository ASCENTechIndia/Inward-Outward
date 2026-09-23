import React, { useState } from "react";

const RadioGroup = ({
  name,
  options = [], // [{ label: "Male", value: "male" }, ...]
  defaultValue = "",
  onChange,
  required = false,
  direction = "vertical", // vertical | horizontal
  className = "",
  error = "",
}) => {
  const [selected, setSelected] = useState(defaultValue);

  const handleChange = (value) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div
      className={`flex ${
        direction === "horizontal" ? "flex-row space-x-6" : "flex-col space-y-3"
      } ${className}`}
    >
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleChange(option.value)}
            required={required}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}

      {error && !selected && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;
