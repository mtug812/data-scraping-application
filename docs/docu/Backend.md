# 🖥️ Backend Documentation


## 🚀 Overview
The **backend** of the Web Scraping Project is responsible for:
- **Managing web scraping tasks** using BeautifulSoup, Scrapy, or Selenium.
- **Processing and cleaning data** before storage.
- **Providing an API** to serve the scraped data to the frontend or external applications.
- **Handling database operations** for storing and retrieving scraped data.

## 📌 Features:
- ✅ Scrapes static websites using BeautifulSoup  
- ✅ Extracts plain text from web pages  
- ✅ Saves the scraped data as a `.txt` file  
- ✅ Returns scraped data as JSON  
- ✅ Simple & fast API 

## Prerequisites:
- Python 3.8+
- Flask
- BeautifulSoup (for HTML parsing)

## Quick Start:
To run the API locally:
```bash
python app.py
```

## Code


##     1. routes.py:
- scrape():

    📌 **Description:**  
This route **scrapes a static website** using **BeautifulSoup** and returns the extracted HTML.

```
@app.route("/scrape_with_bs4", methods=["POST"]) 
```
Defines a route for a specific URL and specifies which HTTP method is allowed

this Function calls the scrapes_with_bs4 function that scrapes static websites and return the data as HTML

📌**Response:**

```
jsonify({"html": raw_html})
```
it returns a jsonify file and send it to the frontend to show it to the user


**Why jsonify file ?** 

It's better to return JSON to the frontend because JSON is lightweight, structured, and universally supported by typeScript

- download_txt():

📌 ** Description:**

   This route returns the scraped HTML content as a downloadable .txt file.

   it calls the `raw_html_to_txt_file()` to save scraped HTML into a `.txt` file
 


## 2. in scraper.py 
-`/scrape_with_bs4()` (POST):

📌 **Description:** 
Scrapes a static website and returns extracted text.

### **Request Format**
Send a **POST request** with a JSON body:
```json
{
    "url": "https://example.com"
}
```
Response Format:
```
{
    "html": "<html>...</html>"
}
```

## 📌 How the Scraper Function Works

| Step | Description |
|------|-------------|
| **1️⃣ Send HTTP Request** | The function **sends a request** to the specified URL using `requests.get()`. |
| **2️⃣ Check Response Status** | If the response **is not `200 OK`**, an error is returned. |
| **3️⃣ Parse HTML with BeautifulSoup** | The HTML content is parsed using **BeautifulSoup** to clean the page. |
| **4️⃣ Return Cleaned HTML** | The cleaned HTML is formatted using `soup.prettify()` and returned. |


## 📌 Error Handling

The scraper function **handles errors** and returns structured JSON responses.

| Error Type       | Status Code       | Example Response                           |
|-----------------|------------------|-------------------------------------------|
| **Missing URL**  | `400 Bad Request` | ```json {"error": "URL is required"}``` |
| **Invalid URL**  | `400 Bad Request` | ```json {"error": "Failed to retrieve content"}``` |
| **Request Timeout** | `500 Server Error` | ```json {"error": "An error occurred: timeout"}``` |

✅ **If an error occurs, the function returns a structured JSON error message instead of crashing.**
