import React from "react";

const TextArea = ({
  field,       // from Formik Field (includes value, onChange, onBlur)
  form,        // from Formik Field
  placeholder = "",
  required = false,
  rows = 4,
  className = "",
  error = "",   // optional custom error message
  resize = "resize-y",
  restrictInput, // 👈 pass inputHandlers.x here
}) => {
  const showError = error && form.touched[field.name] && form.errors[field.name];

  const handleChange = (e) => {
    if (restrictInput) {
      // use your handler instead of default
      restrictInput(e, form.setFieldValue, field.name);
    } else {
      field.onChange(e); // fallback to normal
    }
  };

  return (
    <div className="mb-4">
      <textarea
        {...field}
        value={field.value || ""} // ensure controlled
        rows={rows}
        placeholder={placeholder}
        required={required}
        onChange={handleChange} // 👈 custom change handler
        className={`w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          ${resize} 
          ${showError ? "border-red-500" : "border-gray-300"} 
          ${className}`}
      />
      {showError && (
        <p className="text-red-500 text-sm mt-1">{form.errors[field.name]}</p>
      )}
    </div>
  );
};

export default TextArea;
