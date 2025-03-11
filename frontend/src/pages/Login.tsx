import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../api/globalvariables";

const Login = () => {
  // State variables for managing authentication
  const [authing, setAuthing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // Function to handle login with email and password
  const signInWithEmail = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setAuthing(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: email,
        password: password,
      });
      if (response.data.status === 1) {
        // Login successful
        // Store authentication status in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        

        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        // Redirect to dashboard or home page
        navigate("/");
      } else {
        // Handle API error with status 2
        setError(response.data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      // Handle network or server errors
      console.error("Login error:", err);

      // Type assertion to treat err as AxiosError
      const axiosError = err as AxiosError<{ error?: string }>;

      if (axiosError.response && axiosError.response.data) {
        setError(axiosError.response.data.error || "An error occurred during login");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setAuthing(false);
    }
  };
  return (
    <div className="flex min-h-screen w-full">
      {/* left side */}
      <div className="w-1/3 bg-blue-600 text-white flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-bold mb-4">Web Scraper App</h2>
          <p className="text-xl mb-6">Extract data from websites with ease</p>
          
          <div className="border-t border-blue-400 pt-6 mt-6 w-full">
            <p className="mb-4">Our tool allows you to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Scrape content from static websites</li>
              <li>Save results as text files</li>
              <li>View your scraping history</li>
              <li>Choose between different scraping methods</li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="py-3 text-center text-sm border-t border-blue-500">
          &copy;{new Date().getFullYear()} Hochschule Augsburg & LNU Student Team Project
        </div>
      </div>

      {/* right side */}
      <div className="w-2/3 bg-blue-50 flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          {/* Header section */}
          <div className="w-full flex flex-col mb-10 text-gray-800">
            <h3 className="text-4xl font-bold mb-2 text-blue-700">Login</h3>
            <p className="text-lg mb-4">Welcome Back! Please enter your details.</p>
          </div>

          {/* Error message display */}
          {error && <div className="w-full bg-red-100 text-red-600 p-3 rounded-md mb-4 border border-red-200">{error}</div>}

          {/* Input fields -  */}
          <div className="w-full flex flex-col mb-6">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                id="email"
                type="text"
                className="w-full text-gray-800 py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                id="password"
                type="password"
                className="w-full text-gray-800 py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    signInWithEmail();
                  }
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login button */}
          <div className="w-full flex flex-col mb-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
              onClick={signInWithEmail}
              disabled={authing}
            >
              {authing ? "Logging in..." : "Log In"}
            </button>
          </div>

          {/* Sign up link */}
          <div className="w-full flex items-center justify-center mt-10">
            <p className="text-sm font-normal text-gray-600">
              Don't have an account?{" "}
              <span className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
                <a href="/signup">Sign Up</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
