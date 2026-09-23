import { useState, useEffect } from "react";
import Navbar from "../HOC/Navbar/Navbar";
import Header from "../HOC/Header/Header";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Layout = ({ title, breadcrumb, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Navbar
        isOpen={isOpen}
        onClose={() => {
          if (window.innerWidth < 768) {
            setIsOpen(false);
          }
        }}
      />

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden transition-all duration-300
          bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100
          ${isOpen ? "md:ml-0" : "md:ml-0"}`}
      >
        {/* Top header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main page content */}
        <main className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4">
          <div className="max-w-screen-2xl mx-auto">
            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-8px_rgba(15,23,42,0.08)] overflow-hidden">
              {/* Header strip with title + breadcrumb */}
              {(title || breadcrumb) && (
                <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/60">
                  <div className="flex items-center gap-3">
                    {/* Accent bar */}
                    <span className="h-7 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />

                    <div className="flex-1 min-w-0">
                      {title && (
                        <h1 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight truncate">
                          {title}
                        </h1>
                      )}

                      {breadcrumb && (
                        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Link
                            to={breadcrumb.homeLink || "/dashboard"}
                            className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <Home className="w-3 h-3" />
                            {breadcrumb.homeText || "Home"}
                          </Link>
                          {breadcrumb.current && (
                            <>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-700 font-medium">
                                {breadcrumb.current}
                              </span>
                            </>
                          )}
                        </nav>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="p-4 md:p-4">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
