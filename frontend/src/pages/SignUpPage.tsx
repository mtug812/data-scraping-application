import React, { useState } from 'react';
import {BASE_URL} from '../api/globalvariables'
import sendAxiosRequest, { downloadFile, previewFile } from '../api/axios';
import "../stylers/SignUpPage.css";
import Navbar from '../components/Navbar';

const SignUpPage: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSignUp = async () => {

        let errors: string [] = []; // Here are the errors stored

        console.log(password);
        console.log("sending to backend:", {
          user: userName,
          password: password,
        });
        
        //checks if userename is missing
        if (!userName.trim()) {
            errors.push("Please enter a username");
        }

        //checks if e-mail is missing or incorrect
        if(!email.trim()) {
            errors.push("Please enter your E-mail");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Invalid E-mail");
        }

        //checks if user "created" a password and if it is at least 7 characters long
        if (!password.trim()) {
            errors.push("Please enter a password");
        } else if (password.length < 7) {
            errors.push("Password must contain at least 7 characters!");
        }

        //user has to repeat/confirm his choosen password, if it's not matching we get an error
        if (!confirmPassword.trim()) {
            errors.push("Please repeat your password");
        } else if (confirmPassword != password) {
            errors.push("Passwords are not matching!")
        }

        //if there any errors, we will show them all together
        if (errors.length < 0) {
            window.alert("Please correct the following fields:\n- " + errors.join("\n-"));
            return;
        }

        const response = await sendAxiosRequest(`${BASE_URL}/signup`, {
            user:userName, 
            password:password
        });

        if (response) {
            console.log("User created:", response);
            window.alert("Account successfully created! You can now log in.");

            //window.alert.href = "/login";
            
        } else {
           window.alert("Sign-Up failed. Please try again.");
        }

    }

    return(
        // Create a container with Tailwind classes for appearance (min-height, background, padding)
        <div className=" min-h-screen bg-gray-100 p-4 flex flex-col items-center pt-20">
            {/* Main page title */}
            <h1 style={{outline:"2px",width:"100%"}}className="text-2xl font-bold mb-4 text-center">
            Web Scraping Made Simple
            <h2 className="m-0">Extract and clean web data</h2>
            </h1>
            
            <Navbar/>
            <h3>Create Username:</h3>
            <input
                className="username"
                type="text"                           // The input type is text
                value={userName}                      // Input value is urlInput from component state
                onChange={(e) => setUserName(e.target.value)} // Update state when user taps
            />
        
        <h3> Enter E-Mail:</h3>
            <input
                className="enterEmail"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <h3> Create Password:</h3>
            <input
                className="createPassword"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

             <h3> Confirm Password</h3>
            <input
                className="confirmPassword"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />  

            <button className="signupButton" onClick={handleSignUp}>Sign-Up</button>

            <footer className='footer'>
            <p>&copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project</p>
            </footer>

      </div>
    )
}

export default SignUpPage;