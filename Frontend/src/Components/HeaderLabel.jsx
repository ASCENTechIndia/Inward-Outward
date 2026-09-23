import React from "react";

const HeaderLabel = ({
  text,
  size = "text-xl",   // text size: text-lg, text-2xl etc.
  align = "text-left", // alignment: text-left, text-center, text-right
  underline = true,   // show underline
  className = "",
}) => {
  return (
    <h2
      className={`${size} font-semibold text-gray-800 mb-4 ${align} ${underline ? "border-b-2 border-gray-300 pb-2" : ""} ${className}`}
    >
      {text}
    </h2>
  );
};

export default HeaderLabel;
