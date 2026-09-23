import React, { useState } from "react";
import { useFormikContext } from "formik";
import { X } from "lucide-react";

const FileUpload = ({
  disabled,
  name = "file",
  multiple = false,
  onChange,
  accept = "image/png, image/jpeg, application/pdf",
  validateFile,
}) => {
  const formik = useFormikContext();
  const { setFieldValue } = formik;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const showError = hasInteracted || formik.submitCount > 0;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      let validFiles = files;

      if (validateFile) {
        validFiles = files.filter((file) => {
          const error = validateFile(file);
          if (error) alert(error);
          return !error;
        });
      }

      if (validFiles.length === 0) {
        event.target.value = "";
        return;
      }

      setSelectedFiles(validFiles);
      setFieldValue(name, multiple ? validFiles : validFiles[0]);
      setHasInteracted(true);

      if (onChange) {
        onChange(multiple ? validFiles : validFiles[0]);
      }

      event.target.value = "";
    }
  };

  const handleFileRemove = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFieldValue(
      name,
      updatedFiles.length ? (multiple ? updatedFiles : updatedFiles[0]) : ""
    );
    setHasInteracted(true);
  };

  return (
    <div className="w-full max-w-md space-y-3">
      {/* Upload Button */}
      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-200">
        Choose {multiple ? "Files" : "File"}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </label>

      {/* Selected Files */}
      {selectedFiles.length > 0 ? (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700"
            >
              <span className="truncate">{file.name}</span>
              <X
                className="w-4 h-4 text-gray-500 hover:text-red-600 cursor-pointer"
                onClick={() => handleFileRemove(index)}
              />
            </div>
          ))}
        </div>
      ) : formik.values[name] && typeof formik.values[name] === "string" ? (
        <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700">
          {formik.values[name]}
        </div>
      ) : (
        <span className="text-xs text-gray-400">No file chosen</span>
      )}

      {/* Error Message */}
      {showError && formik.errors[name] && (
        <div className="text-sm text-red-500">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default FileUpload;
