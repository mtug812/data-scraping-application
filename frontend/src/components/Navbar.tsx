import "../stylers/Navbar.css"
import React from "react"

const Navbar: React.FC = () => {

    return (
        <nav className= "nav">
            <ul>
                <li>
                    <a href="/" className= "homepage"> Homepage </a>
                </li>
                <li>
                    <a href="/signup" className= "signup"> Sign Up </a>
                </li>
                <li>
                    <a href="/login" className= "login"> Log In </a>
                </li>
            </ul>
        </nav>
    )

}
export default Navbar;