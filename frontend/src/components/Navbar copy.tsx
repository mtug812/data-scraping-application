import "../stylers/Navbar.css";
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
    <nav className="nav">
      <ul>
        <li>
          <a href="/" className="homepage">
            {" "}
            Homepage{" "}
          </a>
        </li>
        {!isAuthenticated ? (
          <>
            <li>
              <a href="/signup" className="signup">
                Sign Up
              </a>
            </li>
            <li>
              <a href="/login" className="login">
                Log In
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/history" className="history">
                History
              </a>
            </li>
            <li className="logout">
              <LogoutButton />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
