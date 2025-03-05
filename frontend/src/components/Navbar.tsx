import "../stylers/Navbar.css"
import React, { useEffect, useState } from "react"
import LogoutButton from "./LogoutButton";
const Navbar: React.FC = () => {

    // State pentru a ține starea de autentificare
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Verificăm starea de autentificare la încărcarea componentului și când se schimbă localStorage
    useEffect(() => {
        const checkAuth = () => {
            const authStatus = localStorage.getItem("isAuthenticated");
            setIsAuthenticated(authStatus === "true");
        };

        // Verifică inițial
        checkAuth();

        // Adaugă un event listener pentru a detecta schimbările în localStorage
        window.addEventListener('storage', checkAuth);

        // Curăță event listener-ul la demontarea componentului
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    return (
        <nav className= "nav">
            <ul>
                <li>
                    <a href="/" className= "homepage"> Homepage </a>
                </li>
                {!isAuthenticated ? (
                    <>
                        <li>
                            <a href="/signup" className="signup">Sign Up</a>
                        </li>
                        <li>
                            <a href="/login" className="login">Log In</a>
                        </li>
                    </>

                ) : (
                    <>
                    <li>
                        <a href="/history" className="history">History</a>
                    </li>
                    <li className="logout">
                        <LogoutButton />
                    </li>
                </>


                )}
                
            </ul>
        </nav>
    )

}
export default Navbar;