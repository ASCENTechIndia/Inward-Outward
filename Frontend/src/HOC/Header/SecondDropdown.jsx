import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaUserLarge } from "react-icons/fa6";
import { LiaHospital } from "react-icons/lia";
import { TiArrowSortedDown } from "react-icons/ti";

const SecondDropdown = () => {
  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full justify-center gap-x-1 rounded-md bg-white px-3 py-[6px] text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 items-center">
        <FaUserLarge size={16} />
        Admin
        <TiArrowSortedDown size={20} />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Profile
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Settings
            </a>
          </MenuItem>
          <MenuItem className="border border-t-1 border-r-0 border-b-0 border-l-0 border-gray-300">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Logout
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default SecondDropdown;
