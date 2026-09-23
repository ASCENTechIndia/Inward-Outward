import { useState, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserIconDropdown from "../../Components/UserIconDropdown";
import apiService from "../../../apiService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = ({ toggleSidebar: parentToggleSidebar }) => {
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const userName = user?.username;
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [corpName, setCorpName] = useState("");
  const [corpEName, setCorpEName] = useState("");
  const [logo, setLogo] = useState(null);

  // Fetch corporation details
  useEffect(() => {
    const fetchCorpDetails = async () => {
      if (!ulbId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/textLogo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ulbId }),
        });
        const data = await res.json();
        if (data.success) {
          setCorpName(data.data.ABC_MUNICIPAL_TEXT);
          setCorpEName(data.data.ABC_MUNICIPAL_ETEXT);
          setLogo(data.data.ULBLOGO);
        }
      } catch (err) {
        console.error("Error fetching corporation details:", err);
      }
    };
    fetchCorpDetails();
  }, [ulbId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    parentToggleSidebar();
  };

  return (
    <header
      className="sticky top-0 z-30 w-full h-16 px-4 md:px-6
        bg-white/85 backdrop-blur-md
        border-b border-slate-200
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        flex items-center justify-between gap-3"
    >
      {/* ---------- Left: Menu toggle ---------- */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-600
            hover:bg-slate-100 hover:text-slate-900
            active:scale-95 transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="w-5 h-5" strokeWidth={2.2} />
        </button>
      </div>

      {/* ---------- Center: Logo + Title ---------- */}
      <div className="flex-1 flex items-center justify-center gap-3 min-w-0 px-2">
        {logo && (
          <img
            src={logo}
            alt="Corporation Logo"
            className="h-9 w-9 md:h-10 md:w-10 object-contain flex-shrink-0"
          />
        )}

        <div className="flex flex-col items-center justify-center min-w-0 leading-tight text-center">
          <h1
            className="text-sm sm:text-base md:text-lg font-semibold
              text-slate-800 tracking-tight
              truncate max-w-[60vw] sm:max-w-[50vw] md:max-w-[40vw]"
            title={corpName}
          >
            {corpName || "Municipal Corporation"}
          </h1>
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-blue-600">
            Inward / Outward
          </p>
        </div>
      </div>

      {/* ---------- Right: User dropdown ---------- */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <UserIconDropdown name={userName} className="w-9 h-9 md:w-10 md:h-10" />
      </div>
    </header>
  );
};

export default Header;
