# 🎨 Frontend Developer Documentation

## 🚀 Introduction

The Web Scraper Application is a **React-based** web interface that enables users to:

- Extract data from websites using different scraping methods.

- View and download scraped results.

- Manage scraping history.

The frontend **communicates** with a Flask-based backend API to:
- Perform scraping operations.

- Manage user authentication.

- Store scraping history.

---

## 🛠️ Project Setup

### ✅ **Prerequisites**
Before starting, ensure you have installed:
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)

### 📥 **Installation**
Follow these steps:

```sh
# 1️⃣ Clone the repository
git clone https://github.com/AliRasikh/data-scraping-application.git
cd data-scraping-application/frontend
```

# 2️⃣ Install dependencies
```bash
npm install   # or yarn install
```

🔧 Environment Configuration
Create a .env file in the root of the frontend directory:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

🔹 Replace the URL with your backend server URL if it's different.

### 🚀Running the Development Server

To start the development server:

```bash
npm run dev   # or yarn dev
```

This will start the Vite development server, typically on http://localhost:5173. The application will automatically reload if you make changes to the source files.

### 📦 Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will generate optimized files in the dist directory. You can preview the production build locally with:

```bash
npm run preview
# or
yarn preview
```

## 🏗️Project Structure

The frontend codebase is organized as follows:


frontend/
├── public/            # Static assets that don't need processing
├── src/               # Source code
│   ├── api/           # API communication (Axios requests)
│   ├── components/    # Reusable UI components
│   ├── const/         # Constants, types, and utility functions
│   ├── pages/         # Page components
│   ├── routes/        # Routing configuration
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── .env               # Environment variables
├── index.html         # HTML template
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration


## Technology Stack
| Step  | Description   |
|-----------|--------|
| 1️⃣ Login Process400 | User submits credentials to /login API. |
| 2️⃣ Token Storage |JWT token is stored in localStorage.|
| 3️⃣ Authenticated Requests|All protected API requests include Authorization: Bearer <token>.|
| 4️⃣ Logout Process |Token is removed from storage.|

The frontend is built with the following technologies:

- *React 19*: UI library for building component-based interfaces
- *TypeScript*: For type safety and enhanced developer experience
- *Vite*: Fast, modern frontend build tool
- *React Router v7*: For client-side routing
- *Axios*: For HTTP requests to the backend API
- *Tailwind CSS*: For styling and responsive design
- *Prettier*: Code formatting tool for maintaining consistent code style across the project
## Application Architecture

### Routing

The application uses React Router v7 for handling client-side routing. The routes are defined in src/routes/AppRoutes.tsx:

typescript
// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ScrapePage from "../pages/ScrapePage";
import Login from "../pages/Login";
import SignUpPage from "../pages/SignUpPage";
import HistoryPage from "../pages/HistoryPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ScrapePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
};

export default AppRoutes;


### State Management

The application uses React's built-in state management capabilities instead of external state management libraries:

- *useState Hook*: Manages component-specific state variables (such as form inputs, UI states, loading flags)
- *useEffect Hook*: Handles side effects including:
  - Data fetching from the backend API
  - Authentication status verification
  - Event listeners for browser storage changes
  - Cleanup operations when components unmount

*For persistent state across sessions:*

Authentication state is stored in localStorage to persist across page refreshes and browser sessions:
- isAuthenticated: Boolean flag indicating if a user is logged in
- authToken: JWT token used for authenticated API requests

*Example of state management in components:*

```typescript
// Local component state with useState
const [urlInput, setUrlInput] = useState<string | undefined>(undefined);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | undefined>(undefined);

// Side effects with useEffect
useEffect(() => {
  // Check authentication on component mount
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }
  
  // Fetch data from API
  fetchData();
  
  // Cleanup function (runs on component unmount)
  return () => {
    // Cleanup operations if needed
  };
}, [navigate]); // Dependencies array
### API Communication
```
The application communicates with the backend API using Axios. The API integration is configured in `src/api/axios.ts` and `src/api/globalvariables.ts`.

#### Base URL Configuration

```typescript
// src/api/globalvariables.ts
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

#### API Requests

```typescript
// src/api/axios.ts
import axios from "axios";

export const sendAxiosRequest = async (url: string, data: object) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
```

// More utility functions for file handling...


## Components Overview

### Pages

#### ScrapePage.tsx

The main page where users can input a URL, select a scraping method, and execute scraping operations.

**Key Features:**
- URL input with validation
- Scraping method selection (Requests, BeautifulSoup, Selenium)
- Optional data cleaning and company name input for Selenium
- Loading state during scraping
- Preview and download functionality for scraped content

**Key State Variables:**
typescript
const [urlInput, setUrlInput] = useState<string | undefined>(undefined);
const [selectedOption, setSelectedOption] = useState<RadioOption>("requests");
const [cleanData, setCleanData] = useState<boolean>(false);
const [companyName, setCompanyName] = useState<string>("");
const [scrapedPage, setScrapedPage] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(false);


#### HistoryPage.tsx

Displays the user's scraping history with color-coded visualization of different scraping methods.

**Key Features:**
- Authentication check to redirect unauthenticated users
- Fetching and displaying scraping history from the backend
- Color-coded labels for different scraping methods
- Preview of scraped content
- Download functionality for previously scraped content

**Implementation:**
```typescript
// Authentication check
useEffect(() => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }
  fetchHistory();
}, [navigate]);

// Fetching history
const fetchHistory = async () => {
  try {
    // API call to fetch history
    // Processing and displaying results
  } catch (err) {
    // Error handling
  }
};

```

#### Login.tsx

Handles user authentication with email and password.

**Key Features:**
- Email and password validation
- Error handling for authentication failures
- JWT token storage in localStorage
- Redirection after successful login

**Implementation:**
```typescript
const signInWithEmail = async () => {
  // Validation
  // API call to backend authentication endpoint
  // Store token and authentication status
  // Redirect to main page
};
```

#### SignUpPage.tsx

Manages new user registration with form validation.

**Key Features:**
- Form validation for username, email, and password
- Password confirmation
- Error handling for registration failures
- Success feedback and redirection

### Reusable Components

#### Navbar.tsx

Navigation component that appears on all pages, with conditional rendering based on authentication status.

**Implementation:**
```typescript
// Check authentication status
useEffect(() => {
  const checkAuth = () => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  };
  // Add event listener for auth changes
  // ...
}, []);

// Render different links based on auth status
return (
  <nav>
    {!isAuthenticated ? (
      // Links for non-authenticated users
    ) : (
      // Links for authenticated users
    )}
  </nav>
);
```

#### LogoutButton.tsx

Handles user logout by clearing authentication state.

**Implementation:**
typescript
const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isAuthenticated");
  delete axios.defaults.headers.common["Authorization"];
  navigate("/login");
};


#### RadioButtonsExample.tsx

Provides a customizable radio button group for selecting scraping methods, with additional input fields based on selection.

**Props:**
typescript
type RadioButtonsProps = {
  setter: Dispatch<SetStateAction<RadioOption>>;
  getter: string;
  cleanData: boolean;
  setCleanData: Dispatch<SetStateAction<boolean>>;
  companyName: string;
  setCompanyName: Dispatch<SetStateAction<string>>;
};


## Authentication Flow

The application uses JWT-based authentication:

1. **Login Process**:
   - User submits email and password to `/login` endpoint
   - Backend validates credentials and returns a JWT token
   - Frontend stores token in localStorage and sets `isAuthenticated` flag
   - Axios is configured to include the token in subsequent requests

2. **Authentication Check**:
   - Protected pages (like History) verify authentication status on load
   - If not authenticated, redirect to login page

3. **Logout Process**:
   - Remove token and authentication flag from localStorage
   - Clear authorization headers from Axios
   - Redirect to login page

**Example Authentication Check:**
```typescript
useEffect(() => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    navigate("/login");
  }
}, [navigate]);
```

**Example API Call with Authentication:**
```typescript
const fetchData = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");
  
  const response = await axios({
    method: "get",
    url: ${BASE_URL}/endpoint,
    headers: {
      Authorization: Bearer ${token},
      "Content-Type": "application/json",
    },
  });
  
  // Process response...
};
```

## Scraping Functionality

The application offers three scraping methods, each with different capabilities:

1. **Requests**:
   - Simple HTTP requests to retrieve static content
   - Fastest method but limited to static websites

2. **Beautiful Soup (BS4)**:
   - HTML parsing and content extraction
   - Option to clean and format the data
   - Better for more complex static websites

3. **Selenium**:
   - Browser automation for dynamic websites
   - Can interact with JavaScript-driven content
   - Requires a company name for search functionality
   - Slowest but most powerful method

**Scraping Process:**
1. User enters a URL and selects a scraping method
2. Additional options are configured based on the selected method
3. The scraping request is sent to the backend
4. Results are displayed with options to preview and download

**Implementation:**
```typescript
const handleScrape = async () => {
  // Validation
  try {
    setIsLoading(true);
    
    // Prepare request payload based on selected method
    const payload = {
      url: urlInput,
      scraping_method: selectedOption,
      clean_data: cleanData,
      company_name: selectedOption === "selenium" ? companyName : undefined,
    };
    
    // Send request to backend
    const response = await axios.post(${BASE_URL}/scrape, payload, {
      headers: { Authorization: Bearer ${token} },
    });
    
    // Process successful response
    setScrapedPage(response.data.scrape_result);
    
  } catch (err) {
    // Error handling
  } finally {
    setIsLoading(false);
  }
};
```

## Code Conventions

The project follows these coding conventions:

1. *TypeScript Usage*:
   - Define interfaces for all props and state
   - Use type assertions when necessary
   - Leverage TypeScript's type checking to prevent runtime errors

2. *Component Organization*:
   - Pages are stored in src/pages/
   - Reusable components are in src/components/
   - API integration is in src/api/
   - Types and constants are in src/const/

3. *Naming Conventions*:
   - PascalCase for component names and types
   - camelCase for variables, functions, and props
   - File names match the component name (e.g., ScrapePage.tsx)

4. *Error Handling*:
   - Use try/catch blocks for API calls
   - Set error state for UI feedback
   - Log detailed errors to console for debugging

5. *Styling*:
   - Use Tailwind CSS utility classes for styling
   - Consistent color scheme with blue as the primary color
   - Responsive design using Tailwind's breakpoint utilities

## Troubleshooting

### Common Issues and Solutions

1. *Backend Connection Issues*:
   - Check that the backend server is running
   - Verify the VITE_API_BASE_URL in your .env file is correct
   - Check browser console for CORS errors

2. *Authentication Problems*:
   - Check that the token is being stored correctly in localStorage
   - Verify token format in API requests (should be Bearer <token>)
   - Check token expiration (backend validates token lifetime)

3. *Build Issues*:
   - Run npm clean-install or yarn install --force to reset dependencies
   - Check TypeScript errors in the console
   - Verify that all required environment variables are set

4. *Styling Issues*:
   - Make sure Tailwind CSS is properly configured
   - Check for conflicting class names
   - Use browser developer tools to inspect element styles

### Development Tips

1. *Adding New Routes*:
   - Create a new page component in src/pages/
   - Add the route in src/routes/AppRoutes.tsx
   - Add navigation links in Navbar.tsx if needed

2. *Adding New API Endpoints*:
   - Update or add functions in src/api/axios.ts
   - Use the existing pattern for API calls
   - Handle authentication headers for protected endpoints

3. *Component Development*:
   - Start with defining the props interface
   - Implement the component with appropriate state
   - Add error handling for any asynchronous operations
   - Test the component in isolation before integration