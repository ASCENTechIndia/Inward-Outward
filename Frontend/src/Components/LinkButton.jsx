// import React from "react";
// import { Link } from "react-router-dom";
// // import "bootstrap/dist/css/bootstrap.min.css";
// import "./LinkButton.css";

// const LinkButton = ({
//   text,
//   to,
//   onClick,
//   customClass = "",
//   type = "button",
// }) => {
//   return (
//     <button
//       className={`link-button w-md-auto ${customClass}`}
//       onClick={onClick}
//       type={type} // ✅ Set button type (default to "button")
//     >
//       {to ? (
//         <Link to={to} className="btn-link">
//           {text}
//         </Link> // ✅ Ensuring proper styling
//       ) : (
//         text
//       )}
//     </button>
//   );
// };

// export default LinkButton;





import React from "react";
import { Link } from "react-router-dom";

const LinkButton = ({ text, to, onClick, customClass = "", type = "button" }) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200";

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${customClass}`}>
        {text}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${customClass}`}
    >
      {text}
    </button>
  );
};

export default LinkButton;
