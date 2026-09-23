import React from "react";

const SearchBox = ({
  placeholder = "Search patients, appointments...",
  onChange,
  className = ""
}) => {
  return (
    <div className={`flex-grow ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-full px-4 py-2 border border-gray-300 bg-gray-100 transition duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
};

export default SearchBox;
