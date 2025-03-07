
import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(authStatus === "true");
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <div className="w-full border-b border-gray-200">
      <nav className="py-2">
        <ul className="flex">
          <li>
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 relative group"
            >
              Scrape
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          
          {!isAuthenticated ? (
            <>
              <li>
                <a 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 relative group"
                >
                  Sign Up
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 relative group"
                >
                  Log In
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a 
                  href="/history" 
                  className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 relative group"
                >
                  History
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
