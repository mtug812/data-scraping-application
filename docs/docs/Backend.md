# 🖥️ Backend Documentation


## 🚀 Overview
The **backend** of the Web Scraping Project is responsible for:

- **Managing web scraping tasks** using Requests, BeautifulSoup or Selenium.

- **Processing and cleaning scraped data** .

- **Providing an API** to serve the scraped data to the frontend .

- **Handling database operations** for storing and retrieving scraped data.

## 📌 Features:
- ✅ Scrapes static websites using Requests and BeautifulSoup 
- ✅ Scrapes dynamic websites using Selenium
- ✅ Clean scraped data  
- ✅ Preview or save the scraped data as a `.txt` file 
- ✅ Reliable and secure REST API with JWT Token


## Installation:
To run the backend locally:
```bash
python app.py
```
This guide will walk you through setting up and running the backend of the project.

## 1️⃣ Create a Virtual Environment (Recommended)
Using a virtual environment ensures dependencies are managed properly and avoid conflicts.

Run the following command to create one:

```bash
python -m venv venv #python3 for Mac/Linux
```
Then activate it:

Windows:
```bash
venv\Scripts\activate
```
Mac/Linux:
```bash
source venv/bin/activate
```

## 2️⃣  Install the Required Python Version

Ensure you have the correct Python version installed.
```bash
python --version
```

## 3️⃣ Install Dependencies
After activating the virtual environment, install all required dependencies:
```bash
pip install -r requirements.txt
```

## 4️⃣ Code Quality & Standards
To maintain code quality and consistency, install and configure the following tools:
```bash
pip install mypy flake8 black pylint
```
## 5️⃣ Navigate to the Backend Directory
Move into the backend project folder:
```bash
cd backend
```

## 6️⃣ Run the Backend Server
Start the Flask application:

Windows:
```bash
python app.py
```
Mac/Linux:
```bash
python3 app.py
```

## Code


## 1. app.py (API Endpoints):
## 🔍 Scrape a Website (`/scrape`)

#### 📍 Overview

This route **scrapes a static website** using **BeautifulSoup** or **Requests** and returns the extracted HTML.

```
@app.route("/scrape", methods=["POST"]) 
```
Defines a route for a specific URL and specifies which HTTP method is allowed

this Function calls the scrapes_with_bs4 or scrapes_with_requests function that scrapes static websites and return the data as HTML


#### 📩 Request Parameters

 JSON Body (Required Fields)

| Parameter        | Type    | Required | Description |
|-----------------|---------|----------|-------------|
| `url`           | `string` | ✅ Yes | The URL of the website to scrape. |
| `scraping_method` | `string` | ✅ Yes | The scraping method: `"requests"`, `"bs4"`, or `"selenium"`. |
| `clean_data`    | `boolean` | ❌ No (default: `false`) | Whether to clean the scraped data. |
| `company_name`  | `string` | ✅ Yes (for `"selenium"`) | The name of the company (used for Selenium-based scraping). |

Headers (Optional)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | `string` | ❌ No | JWT token (Required for storing scraping history). |

---

#### 🔄 Processing Steps

1. **Retrieve JSON Data**: Extracts the URL, scraping method, and optional parameters from the request.
2. **Validation**:
   - Ensures the `url` is provided and starts with `https://`. If it starts with `www.`, we will add `https://`
   - Requires `scraping_method` to be one of `"requests"`, `"bs4"`, or `"selenium"`.
   - If using `selenium`, `company_name` is **required**.
3. **Call the Appropriate Scraping Function**:
   - **`requests`** → `scrape_with_requests(url)`
   - **`bs4`** → `scrape_with_bs4(url, clean=clean_data)`
   - **`selenium`** → `scrape_with_selenium(url, company_name, clean=clean_data)`
4. **Store Scraping History** (if JWT token is provided).
5. **Return JSON Response** with the scraped data.



📌**Response:**

---

#### ✅ Success Response

**HTTP Status Code**: `201 Created`

```json
{
  "message": "URL Scraped with selenium and content saved",
  "status": 1,
  "scrape_result": "<scraped HTML data>"
}
```

**Error Responses**

The `/scrape` endpoint may return the following error responses:

| HTTP Status Code | Error Message                         | Description |
|-----------------|-------------------------------------|-------------|
| 400            | `"error": "URL is required"`        | The `url` field is missing in the request body. |
| 400            | `"error": "Scraping method is required"` | The `scraping_method` field is missing in the request body. |
| 400            | `"error": "Company name is required for Selenium"` | The `company_name` field is required when using `"selenium"` as the `scraping_method`. |
| 400            | `"error": "Invalid scraping method"` | The provided `scraping_method` is not recognized (must be `"requests"`, `"bs4"`, or `"selenium"`). |
| 401            | `"error": "Invalid or missing token"` | The request is missing an authorization token or contains an invalid one. |
| 500            | `"error": "Internal Server Error"`  | An unexpected server error occurred. |

👉 **Note**: Ensure all required fields are provided in the JSON request body to avoid errors.


**Why jsonify file ?** 

It's better to return JSON to the frontend because JSON is lightweight, structured, and universally supported by typeScript


## 🔒 Verify Authentication (`/auth`)

**Method:** `GET`  
**Description:** Checks if the provided JWT token is valid.

#### 🔹 Request Headers

| Header         | Type   | Required | Description |
|---------------|--------|----------|-------------|
| Authorization | String | ✅ Yes  | Bearer Token required for authentication. |

#### 🔹 Responses

✅ Success (`200 OK`)

```json
{
    "message": "Token is valid",
    "status": 1
}
```

## 🔑 Login (`/login`)

**Method:** `POST`  
**Description:** Authenticates a user and returns a JWT token.

#### 🔹 Request Body (JSON)
| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `email`   | String | ✅ Yes  | User email. |
| `password` | String | ✅ Yes  | User password. |

#### 🔹 Example Request
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
#### 🔹 Responses

✅ Success (`200 OK`)

```json
{
    "message": "Logged in successfully!",
    "status": 1,
    "token": "your_jwt_token"
}
```
❌ Errors

| HTTP Code  | Message   |
|-----------|--------|
| 400   | "error": "Email does not exist" | 
| 400 | "error": "Incorrect password, try again" |

## 🔑 JWT Token Authentication

In this API, JSON Web Tokens (JWT) are used for user authentication and authorization. JWTs allow secure communication between the client and the server without storing session data.

**How JWT Works**

1. User Logs In

    - The user submits their email and password.

    - If credentials are valid, a JWT is generated:

    ```bash
    token = jwt.encode(
       {
          "user": email,  # Store user email in the token
          "user_id": user.id,  # Store user ID in the token
          "exp": datetime.utcnow() + timedelta(seconds=1000)  # Expiration time
       },
       app.config["SECRET_KEY"],  # Secret key for encoding
       algorithm="HS256"
    )
    ```
The token is then sent to the client in the response.


2. Client Sends Token in Requests

    - The client includes the token in the Authorization header:

    ```bash
    Authorization: Bearer <token>
    ```

    - The server verifies the token before allowing access.

3. Server Validates the Token

    - When a request is received, the token is decoded and verified:

    ```bash
    decoded_token = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    user_id = decoded_token["user_id"]  # Extract user ID
    ```

    - If the token is valid, the request is processed.
    - If the token is expired or invalid, an error is returned.

**Token Expiration & Security**

Expiration (exp) ensures that tokens are only valid for a limited time (e.g., 1000 seconds).

Secret Key (SECRET_KEY) is used for signing and verifying the token to prevent tampering.

Bearer Authentication method is used to send the token securely.

## 🆕 Sign Up (/sign-up)
**Method**: POST
**Description**: Registers a new user.

###  🔹 Request Body (JSON)
| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `email`   | String | ✅ Yes  | User email. |
| `username` | String | ✅ Yes  | User name. |
| `password`   | String | ✅ Yes  | User password. |
| `repeat_password` | String | ✅ Yes  | Must match the password. |

### 🔹 Example Request
```json
{
    "email": "newuser@example.com",
    "userName": "newuser",
    "password": "password123",
    "repeat_password": "password123"
}
```
#### 🔹 Responses

✅ Success Response (201 Created)

```json
{
    "message": "Account created successfully!",
    "status": 1
}
```

❌ Errors

| HTTP Code  | Message   |
|-----------|--------|
| 400   | "error": "Email already exists" | 
| 400 | "error": "Passwords don't match" |
| 400 |  "error": "Password must be at least 7 characters"|

## 🔐 Password Hashing

In this API, user passwords are securely stored using PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256 hashing. This ensures that passwords are not stored in plain text, enhancing security.

How It Works:

- When a user signs up, the password is hashed using:

```bash
hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
```

- The hashed password is stored in the database instead of the plain password.

- During login, the entered password is hashed again and compared with the stored hash:
```bash
check_password_hash(stored_hashed_password, entered_password)
```
- If the hashes match, authentication is successful.

## 📜 View Scraping History (`/history`)

**Method:** `GET`  
**Description:** Retrieves the scraping history of the logged-in user.
**Authentication:** ✅ Requires a valid JWT token in the Authorization header.

#### 🔹 Request
Headers:

Header	| Type|	Required |	Description |
|---------|--------|-------|-------------|
Authorization|	String|	✅ Yes|	Bearer token for authentication|

#### 🔹 Responses

✅ Success (`200 OK`)
```json
[
    {
        "url": "https://example.com",
        "scraped_data": "<html>...</html>",
        "date": "2024-03-10 15:30:00"
    }
]
```

## 2. scraper.py 

## scrape_with_Requests() (POST):

#### **Description:** 
Scrapes a static website and returns extracted text.

#### **Parameters**
Parameter|	Type|	Required|	Description|
|-----------|-------|-----|----------------|
url	|str	|✅	|The URL to scrape|

####   **Request Format**
Send a **POST request** with a JSON body:
```json
{
    "url": "https://example.com"
}
```
#### Response Format:
```
{
    "html": "<html>...</html>"
}
```
#### **Returns**
- HTML

If an error occurs, returns a JSON object with an error message.

## scrape_with_bs4 (POST):

#### **Description:** 
Uses BeautifulSoup to parse and prettify the HTML content. It can also clean the HTML to return readable text

#### **Parameters**
Parameter|	Type|	Required|	Description|
----------|--------|--------|---------|
url|	str|	✅|	The URL to scrape|
clean	|bool	|❌|	If True, extracts only readable text|

#### **Request Format**
Send a **POST request** with a JSON body:
```json
{
    "url": "https://example.com"
}
```
#### Response Format:
```
{
    "html": "<html>...</html>"
}
```
#### **Returns**

- Prettified HTML if clean=False
- Readable formatted text if clean=True
- Returns an error message if scraping fails.

## scrape_with_bs4 (POST):
#### **Description:** 
Uses Selenium WebDriver to scrape dynamic web pages that rely on JavaScript execution. It can also clean the HTML to return readable text

#### **Parameters**
Parameter|	Type|	Required|	Description|
-----|---------|--------|----------|
url|	str	|✅|	The URL of the page to scrape|
company_name|	str|	✅|	The company name to search for|
clean	|bool	|❌	|If True, extracts only readable text|

#### **Environment Variables**
CHROME_PATH: Path to the Chrome WebDriver executable.

#### **Returns**

- Scraped page title
- Prettified HTML or clean text, based on clean flag.

## 📌 How the Scraper Function Works

#### 1️⃣ Scraping with Requests (`scrape_with_requests`)
| Step | Description |
|------|------------|
| **1️⃣ Send HTTP Request** | The function **sends a request** to the URL using `requests.get(url)`. |
| **2️⃣ Check Response Status** | If the response **is not `200 OK`**, an error is returned. |
| **3️⃣ Extract Raw HTML** | The function **retrieves and returns** the raw HTML using `response.text`. |

#### 2️⃣ Scraping with BeautifulSoup (`scrape_with_bs4`)
| Step | Description |
|------|------------|
| **1️⃣ Send HTTP Request** | Requests the webpage's **HTML content** using `requests.get(url)`. |
| **2️⃣ Check Response Status** | If response **isn’t `200 OK`**, an error is returned. |
| **3️⃣ Parse HTML** | The function **parses the HTML** with `BeautifulSoup()`. |
| **4️⃣ Clean & Prettify Output** | Returns **cleaned text** or formatted HTML using `soup.prettify()`. |

#### 3️⃣ Scraping with Selenium (`scrape_with_selenium`)
| Step | Description |
|------|------------|
| **1️⃣ Setup Selenium WebDriver** | Configures **Chrome WebDriver** for headless browsing. |
| **2️⃣ Load Webpage** | Opens the webpage using `driver.get(url)`. |
| **3️⃣ Handle JavaScript & Dynamic Content** | Waits for JavaScript-rendered elements to load. |
| **4️⃣ Extract Page Source** | Retrieves **HTML content** using `driver.page_source`. |
| **5️⃣ Clean & Return Data** | Parses the HTML with `BeautifulSoup` or returns **raw HTML**. |



## 📌 Error Handling

The scraper function **handles errors** and returns structured JSON responses.

| Error Type       | Status Code       | Example Response                           |
|-----------------|------------------|-------------------------------------------|
| **Missing URL**  | `400 Bad Request` | ```json {"error": "URL is required"}``` |
| **Invalid URL**  | `400 Bad Request` | ```json {"error": "Failed to retrieve content"}``` |
| **Request Timeout** | `500 Server Error` | ```json {"error": "An error occurred: timeout"}``` |
| **Parsing Error**      | `500 Server Error`     | ```json {"error": "Failed to parse HTML"}``` |
| **Selenium WebDriver Error** | `500 Server Error` | ```json {"error": "Selenium WebDriver error"}``` |

✅ **If an error occurs, the function returns a structured JSON error message instead of crashing.**

## 📌 Comparison of Scraping Methods

| Method          | Best For                     | Pros                          | Cons                         |
|----------------|-----------------------------|-------------------------------|------------------------------|
| **Requests**   | Static websites              | ✅ Fast, ✅ Lightweight        | ❌ No JavaScript support     |
| **BeautifulSoup** | Cleaning & parsing HTML  | ✅ Easy to use, ✅ Lightweight | ❌ Needs requests first      |
| **Selenium**   | JavaScript-heavy pages       | ✅ Handles dynamic content    | ❌ Slower, ❌ Requires WebDriver |

## 3. config.py :

#### 📌 Overview
This module **configures** the Flask application by:

- **Loading environment variables** from a `.env` file.

- **Setting up the database connection** using SQLAlchemy.

- **Enabling CORS** to allow cross-origin requests.

- **Managing security settings** with a secret key.

#### 🚀 Flask App Initialization
```bash
app = Flask(__name__)  # Create an app instance
CORS(app)
CORS(app, supports_credentials=True)
```

- CORS (Cross-Origin Resource Sharing) is enabled to allow requests from different domains.
- supports_credentials=True allows cookies and authentication headers in requests.

#### 🔐 Environment Variables (.env)

- This module loads sensitive configurations from a .env file using dotenv.
- The .env file is not included in version control (Git) to protect sensitive information.
```bash
load_dotenv()  # Load environment variables from .env
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
```
- SECRET_KEY → Used for secure sessions and JWT authentication.

##### 🗄️ Database Configuration
```bash
database_uri = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)  # Create a database instance
```

- SQLALCHEMY_DATABASE_URI → Defines the database connection.
- SQLALCHEMY_TRACK_MODIFICATIONS=False → Disables unnecessary tracking to improve performance.