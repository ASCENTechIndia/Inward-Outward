import React from "react";

const Label = ({ htmlFor, text, required = false, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 ${className}`}
    >
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
