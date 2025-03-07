import React, { useState } from "react";
import { BASE_URL } from "../api/globalvariables";
import sendAxiosRequest from "../api/axios";
import Navbar from "../components/Navbar";

const SignUpPage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    const errors: string[] = []; // Here are the errors stored

    console.log(password);
    console.log("sending to backend:", {
      userName: userName,
      email: email,
      password: password,
      repeat_password: password,
    });

    //checks if userename is missing
    if (!userName.trim()) {
      errors.push("Please enter a username");
    }

    //checks if e-mail is missing or incorrect
    if (!email.trim()) {
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
      errors.push("Passwords are not matching!");
    }

    //if there any errors, we will show them all together
    if (errors.length > 0) {
      window.alert("Please correct the following fields:\n- " + errors.join("\n-"));
      return;
    }

    const response = await sendAxiosRequest(`${BASE_URL}/sign-up`, {
      userName: userName,
      email: email,
      password: password,
      repeat_password: password,
    });

    if (response) {
      console.log("User created:", response);
      window.alert("Account successfully created! You can now log in.");

      //window.alert.href = "/login";
    } else {
      window.alert("Sign-Up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="w-full bg-blue-600 text-white py-4">
        <h1 className="text-2xl font-bold text-center mb-1">Web Scraping Made Simple</h1>
        <h2 className="text-base font-normal text-center">Extract and clean web data</h2>
      </div>
      
      <div className="w-full px-4 pb-16">
        <Navbar />
        
        <div className="w-full max-w-md mx-auto mt-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Create Username:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter E-Mail:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Create Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition mt-6"
              onClick={handleSignUp}
            >
              Sign-Up
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full bg-blue-600 text-white py-2 text-center text-sm mt-auto">
        &copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project
      </div>
    </div>
  );
};

export default SignUpPage;