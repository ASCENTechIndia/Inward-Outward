import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shapes,
  BaggageClaim,
  Boxes,
  HandCoinsIcon,
  ClipboardList,
  ChevronDown,
  Warehouse,
} from "lucide-react";
import SidebarItem from "../../Components/SidebarItem";

// 🔹 Icon mapping by menu label
const iconMap = {
  Home: LayoutDashboard,
  Sender: HandCoinsIcon,
  "Sender Sub Type": HandCoinsIcon,
  "Receiver Category": Boxes,
  "Purpose List": ClipboardList,
  "Document Type": ClipboardList,
  "Inward Mode": BaggageClaim,
  "Outward Mode": BaggageClaim,
  "Receiver Sub Category": Boxes,
  "Document Sub Type": ClipboardList,
  Default: Shapes,
};

const STATIC_MENU = [
  {
    MENUID: 1,
    MENUTITLE: "Master",
    children: [
      { MENUID: 101, MENUTITLE: "Sender", PAGEPATH: "/Masters/FrmSenderList" },
      {
        MENUID: 102,
        MENUTITLE: "Sender Sub Type",
        PAGEPATH: "/Masters/FrmSenderSubtypeList",
      },
      {
        MENUID: 103,
        MENUTITLE: "Receiver Category",
        PAGEPATH: "/Masters/FrmReceiverCtgryList",
      },
      {
        MENUID: 104,
        MENUTITLE: "Purpose List",
        PAGEPATH: "/Masters/FrmPurposeMasterList",
      },
      {
        MENUID: 105,
        MENUTITLE: "Document Type",
        PAGEPATH: "/Masters/FrmDocTypeList",
      },
      {
        MENUID: 106,
        MENUTITLE: "Inward Mode",
        PAGEPATH: "/Masters/FrmInwardModeList",
      },
      {
        MENUID: 107,
        MENUTITLE: "Outward Mode",
        PAGEPATH: "/Masters/FrmOutWardModeList",
      },
      {
        MENUID: 108,
        MENUTITLE: "Receiver Sub Category",
        PAGEPATH: "/Masters/FrmReceiverSubCatList",
      },
      {
        MENUID: 109,
        MENUTITLE: "Document Sub Type",
        PAGEPATH: "/Masters/FrmDocumentSubTypeList",
      },
    ],
  },
  {
    MENUID: 2,
    MENUTITLE: "Congiguration",
    children: [
      {
        MENUID: 201,
        MENUTITLE: "Sender Type Config",
        PAGEPATH: "/Masters/FrmSenderTypeConfig",
      },
      {
        MENUID: 202,
        MENUTITLE: "Sender Sub Type Config",
        PAGEPATH: "/Masters/FrmSenderSubTypeConfig",
      },
      {
        MENUID: 203,
        MENUTITLE: "Userwise Department Config",
        PAGEPATH: "/Masters/FrmOutWardUserConfig",
      },
    ],
  },
  {
    MENUID: 3,
    MENUTITLE: "Inward",
    children: [
      {
        MENUID: 301,
        MENUTITLE: "आवक नोंद",
        PAGEPATH: "/Inward/FrmInwardMst",
      },
      {
        MENUID: 302,
        MENUTITLE: "Inward Close",
        PAGEPATH: "/Inward/FrmInwardDtlsClose",
      },
      {
        MENUID: 303,
        MENUTITLE: "आवक दस्तऐवज जोडा",
        PAGEPATH: "/Inward/FrmInwardDtlsDocument"
      },
      {
        MENUID: 304,
        MENUTITLE: "आवक नोंदणी",
        PAGEPATH: "/Inward/FrmInwardRegister",
      },
      {
        MENUID: 305,
        MENUTITLE: "हस्तांतरण किंवा अंतर्गत संप्रेषण",
        PAGEPATH: "/Inward/FrmInwardDtlsCommunication"
      },
    ],
  },
  {
    MENUID: 4,
    MENUTITLE: "Outward",
    children: [
      {
        MENUID: 401,
        MENUTITLE: "Outward Form",
        PAGEPATH: "/Outward/FrmOutward",
      },
      {
        MENUID: 402,
        MENUTITLE: "Direct Outward Form",
        PAGEPATH: "/Outward/FrmDirectOutwardEntry",
      },
    ],
  },
];

const Navbar = ({ title = "Inward Outward", isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState({});
  const { pathname } = useLocation();

  // 🔹 Auto-open the section containing the active page
  useEffect(() => {
    STATIC_MENU.forEach((section) => {
      const hasActive = section.children?.some(
        (item) => item.PAGEPATH === pathname,
      );
      if (hasActive) {
        setOpenSections((prev) => ({ ...prev, [section.MENUID]: true }));
      }
    });
  }, [pathname]);

  const toggleSection = (menuId) => {
    setOpenSections((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => onClose && onClose()}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <aside
        className={`fixed md:relative top-0 left-0 z-50 h-screen w-64 flex flex-col
          bg-white border-r border-slate-200
          shadow-[2px_0_12px_-4px_rgba(15,23,42,0.06)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:-ml-64 md:translate-x-0"}`}
      >
        {/* ---------- Brand Header ---------- */}
        <div className="flex-shrink-0 h-16 flex items-center gap-2.5 px-5 border-b border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <Warehouse className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-slate-800 tracking-tight">
              {title}
            </span>
          </div>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Home */}
          <div className="mb-4">
            <SidebarItem
              icon={LayoutDashboard}
              label="Home"
              path="/dashboard"
              isOpen={true}
              onClick={() => onClose && onClose()}
            />
          </div>

          {/* Section label */}
          {STATIC_MENU.length > 0 && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Modules
            </p>
          )}

          {/* Accordion Menu */}
          <div className="space-y-1">
            {STATIC_MENU.map((section) => {
              const isOpenSection = openSections[section.MENUID] ?? false;

              return (
                <div key={section.MENUID}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.MENUID)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                      text-[13px] font-semibold text-slate-600
                      hover:bg-slate-50 hover:text-slate-800
                      transition-colors duration-150 group"
                  >
                    <span className="tracking-tight text-[14px]">
                      {section.MENUTITLE}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 group-hover:text-slate-600
                        transition-transform duration-300
                        ${isOpenSection ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Children */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpenSection ? "max-h-[600px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                  >
                    <div className="ml-3 pl-3 border-l border-slate-200 space-y-1">
                      {(section.children || []).map((item) => {
                        const Icon = iconMap[item.MENUTITLE] || iconMap.Default;
                        return (
                          <SidebarItem
                            key={item.MENUID}
                            icon={Icon}
                            label={item.MENUTITLE}
                            path={item.PAGEPATH}
                            isOpen={true}
                            onClick={() => onClose && onClose()}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ---------- Footer ---------- */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-200 bg-slate-50/60">
          <p className="text-[10px] text-slate-400 font-medium text-center">
            © {new Date().getFullYear()} · v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
