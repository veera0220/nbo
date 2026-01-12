import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <nav className="bg-gradient-to-b from-[#0059b3] via-[#004080] to-[#0059b3]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-10 items-center justify-between">

          {/* Left Nav */}
          <div className="flex space-x-6 items-center">

            <Link
              to="/"
              className="text-white text-sm font-semibold hover:underline hover:text-gray-200"
            >
              Home
            </Link>

            {/* My Account (Navigate + Dropdown) */}
            <div className="relative" ref={dropdownRef}>
              <Link
                to="/my-account"
                onClick={() => setOpen(true)}
                className="text-white text-sm font-semibold hover:underline hover:text-gray-200 flex items-center gap-1"
              >
                My Account
                <span
                  className={`text-xs transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </Link>

              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-2 w-44 bg-white rounded shadow-lg border border-gray-200 z-50
                transition-all duration-200 origin-top
                ${
                  open
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >

                <Link
                  to="/user-management"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  User Management
                </Link>
                <Link
                  to="/my-account"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>

                <Link
                  to="/change-password"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </Link>

                <hr />

                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;