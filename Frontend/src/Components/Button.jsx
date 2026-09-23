import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary, secondary, danger
  size = "md", // sm, md, lg
  disabled = false,
  className = "",
  ...rest
}) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
    "transition-all duration-150 select-none whitespace-nowrap " +
    "focus:outline-none focus:ring-2 focus:ring-offset-1 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variantStyles = {
    primary:
      "bg-blue-600 text-white shadow-sm " +
      "hover:bg-blue-700 hover:shadow " +
      "active:scale-[0.98] " +
      "focus:ring-blue-500/40",

    secondary:
      "bg-white text-slate-700 border border-slate-300 shadow-sm " +
      "hover:bg-slate-50 hover:border-slate-400 " +
      "active:scale-[0.98] " +
      "focus:ring-slate-400/40",

    danger:
      "bg-red-600 text-white shadow-sm " +
      "hover:bg-red-700 hover:shadow " +
      "active:scale-[0.98] " +
      "focus:ring-red-500/40",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
