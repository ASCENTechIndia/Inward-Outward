import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, isOpen, path, onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-600 font-medium" // ✅ bright active state
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600" // ✅ normal + hover
        } ${isOpen ? "px-4" : "px-2 justify-center"}`
      }
    >
      <Icon
        className={`flex-shrink-0 ${
          isOpen ? "w-5 h-5" : "w-6 h-6"
        } ${isOpen ? "" : "text-blue-500"}`}
      />
      {isOpen && (
        <span className="text-sm whitespace-normal leading-snug overflow-hidden overflow-ellipsis">
          {label}
        </span>
      )}
    </NavLink>
  );
};

SidebarItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func, // Optional click handler
};

export default SidebarItem;
