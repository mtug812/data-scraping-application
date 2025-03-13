"""
This module provides functionality for web scraping using various methods:
- Requests: For simple HTTP GET requests to retrieve raw HTML content.
- BeautifulSoup: For parsing and prettifying HTML content.
- Selenium: For scraping dynamic web pages that require JavaScript execution.
It also includes a utility function to clean and format HTML content into readable text.
"""

import os
import re
import time

import requests
from bs4 import BeautifulSoup
from flask import jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


def scrape_with_requests(url: str):
    """
    Scrapes the content of the given URL and returns the raw HTML.

    Parameters:
      url (str): The URL of the website to scrape.

    Returns:
      str: The raw HTML content of the page, or an error message.
    """
    try:
        # send an http get request to the url
        response = requests.get(url, timeout=10)
        print("Scraping URL with requests...")

        # Check if the response was successful (status code 200).
        if response.status_code != 200:
            return (
                jsonify(
                    {"status": "failure", "error": "Failed to retrieve URL content"}
                ),
                400,
            )

        # Return the entire HTML content.
        return response.text

    except Exception as e:
        # If an error occurs, return a message with the error details.
        return {"status": "failure", "error": f"An error occurred: {e}"}


def scrape_with_bs4(url: str, clean):
    """
    Scrapes the content of the given URL and returns either the cleaned text or prettified HTML.

    Parameters:
      url (str): The URL of the website to scrape.
      clean (bool): Flag to determine if the HTML content should be cleaned and formatted.

    Returns:
      str: The cleaned text or prettified HTML content of the page, or an error message.
    """
    try:
        # send an http get request to the url
        response = requests.get(url, timeout=10)
        print("Scraping URL with bs4...")

        # Check if the response was successful (status code 200).
        if response.status_code != 200:
            return (
                jsonify(
                    {"status": "failure", "error": "Failed to retrieve URL content"}
                ),
                400,
            )

        # parse the html content using beautifullsp
        soup = BeautifulSoup(response.text, "html.parser")

        return clean_text(response.text) if clean else soup.prettify()

    except Exception as e:
        # If an error occurs, return a message with the error details.
        return f"An error occurred: {e}"


def scrape_with_selenium(url: str, company_name: str, clean):
    """
    company_name (str): The name of the company to search for on the website.
    clean (bool): If True, returns cleaned text; otherwise, returns the prettified HTML.
    str: The scraped HTML content after JavaScript execution, either cleaned or prettified.
    Raises:
    Exception: If an error occurs during the scraping process.
    Environment Variables:
    CHROME_PATH (str): The path to the ChromeDriver executable.
    Example:
    result = scrape_with_selenium("https://example.com", "Example Company", True)
    """
    chrome_path = os.getenv("CHROME_PATH")

    try:
        # Set up Chrome options (headless for better performance)
        chrome_options = Options()
        chrome_options.add_argument("--lang=en")

        service = Service(executable_path=chrome_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)

        driver.get(url)
        time.sleep(2)

        # Handle cookie pop-ups
        cookie_button = driver.find_element(By.NAME, "reject")
        cookie_button.click()
        time.sleep(2)

        search_field_id = "ybar-sbq"
        element_search_field = driver.find_element(By.ID, search_field_id)
        element_search_field.clear()
        element_search_field.send_keys(company_name)
        time.sleep(2)
        element_search_field.send_keys(Keys.ENTER)
        time.sleep(3)
        page_title = driver.title

        # Get the page source after JavaScript execution
        page_source = driver.page_source
        time.sleep(3)

        # Close the browser
        driver.quit()

        # Parse with BeautifulSoup for structured output
        soup = BeautifulSoup(page_source, "html.parser")
        scrape_result = f"Scraped Page Title: {page_title}"
        return scrape_result + (clean_text(page_source) if clean else soup.prettify())

    except Exception as e:
        return f"An error occurred: {e}"


def clean_text(html_content):
    """
    Removes all HTML tags and extracts readable text with formatted output.

    Args:
        html_content (str): The raw HTML content to be cleaned.

    Returns:
        str: The cleaned text in a readable, structured format.
    """
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove scripts, styles, and other unwanted tags
    for tag in soup(
        ["script", "style", "meta", "noscript", "iframe", "svg", "form", "link"]
    ):
        tag.decompose()

    # Extract visible text
    text = soup.get_text(separator=" ", strip=True)
    cleaned_text = " ".join(text.split())

    # Split text into lines
    lines = cleaned_text.splitlines()

    # Initialize formatted output
    formatted_lines = []

    # Extract title (if available)
    title = soup.title.string.strip() if soup.title else "No Title Found"
    formatted_lines.append(f"### {title}\n")  # Markdown-style title

    # Process each line for bullet formatting
    for line in lines:
        line = line.strip()
        if line:  # Ignore empty lines
            line = re.sub(
                r"\s+", " ", line
            )  # Replace multiple spaces with a single space
            formatted_lines.append(f"- {line}")  # Bullet points

    # Convert formatted lines to a readable output
    readable_output = "\n".join(formatted_lines)

    return readable_output
