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
      console.log(response);
      if (response.data.status === 1) {
        // Login successful
        // Store authentication status in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        //config axios to include token in future req

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
    <div className="w-full h-screen flex">
      {/* Left half of the screen - info section */}
      <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center">
        <div className="text-white text-center p-8">
          <h2 className="text-3xl font-bold mb-4">Web Scraper App</h2>
          <p className="text-xl mb-6">Extract data from websites with ease</p>
          <div className="border-t border-gray-600 pt-6 mt-6">
            <p className="mb-4">Our tool allows you to:</p>
            <ul className="list-disc list-inside text-left">
              <li className="mb-2">Scrape content from static websites</li>
              <li className="mb-2">Save results as text files</li>
              <li className="mb-2">View your scraping history</li>
              <li className="mb-2">Choose between different scraping methods</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right half of the screen - login form */}
      <div className="w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          {/* Header section with title and welcome message */}
          <div className="w-full flex flex-col mb-10 text-white">
            <h3 className="text-4xl font-bold mb-2">Login</h3>
            <p className="text-lg mb-4">Welcome Back! Please enter your details.</p>
          </div>

          {/* Error message display */}
          {error && <div className="w-full bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}

          {/* Input field for email & password */}
          <div className="w-full flex flex-col mb-6">
            <input
              type="text"
              placeholder="Email or Username"
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  signInWithEmail();
                }
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button to login with email and password */}
          <div className="w-full flex flex-col mb-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer disabled:opacity-50"
              onClick={signInWithEmail}
              disabled={authing}
            >
              {authing ? "Logging in..." : "Log In"}
            </button>
          </div>

          {/* Link to sign up page */}
          <div className="w-full flex items-center justify-center mt-10">
            <p className="text-sm font-normal text-gray-400">
              Don't have an account?{" "}
              <span className="font-semibold text-white cursor-pointer underline">
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
