import { useState } from "react";
import { BASE_URL } from "../api/globalvariables";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


const SignUpPage = () => {
  const [authing, setAuthing] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const errors: string[] = []; // Here are the errors stored

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
        setError("Please correct the following fields:\n " + errors.join(", \n"));
      return;
    }

    setAuthing(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/sign-up`, {
        userName: userName,
        email: email,
        password: password,
        repeat_password: confirmPassword,
      
      });
      console.log(response);
      if (response.data.status === 1) {
        // Sign up  successful
        // Store authentication status in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        //config axios to include token in future req

        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        // Redirect to dashboard or home page
        navigate("/login");
      } else {
        // Handle API error with status 2
        setError(response.data.error || "sign-up failed. Please try again.");
      }
    } catch (err) {
      // Handle network or server errors
      console.error("sign-up error:", err);

      // Type assertion to treat err as AxiosError
      const axiosError = err as AxiosError<{ error?: string }>;

      if (axiosError.response && axiosError.response.data) {
        setError(axiosError.response.data.error || "An error occurred during sign-up");
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
            <h3 className="text-4xl font-bold mb-2 text-blue-700">Sign-Up</h3>
            <p className="text-lg mb-4">Welcome! Please enter your details.</p>
          </div>

          {/* Error message display */}
          {error && <div className="w-full bg-red-100 text-red-600 p-3 rounded-md mb-4 border border-red-200">{error}</div>}

          {/* Input fields -  */}
          <div className="w-full flex flex-col mb-6">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Create Username:</label>
              <input
                id="userName"
                type="text"
                className="w-full text-gray-800 py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Create password</label>
              <input
                id="password"
                type="password"
                className="w-full text-gray-800 py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSignUp();
                  }
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor=" repeat password" className="block text-sm font-medium text-gray-600 mb-1">Repeat password</label>
              <input
                id="repeat_password"
                type="password"
                className="w-full text-gray-800 py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSignUp();
                  }
                }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
          {/* Sign Up button */}
          <div className="w-full flex flex-col mb-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
              onClick={handleSignUp}
              disabled={authing}
            >
              {authing ? "Signing up..." : "Sign-Up"}
            </button>
          </div>

          {/* Log in link */}
          <div className="w-full flex items-center justify-center mt-10">
            <p className="text-sm font-normal text-gray-600">
              Already have an account?{" "}
              <span className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
                <a href="/login">Log In</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;