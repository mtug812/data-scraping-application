"""
This module provides functionality for web scraping using BeautifulSoup
and handling HTTP requests.
It includes:
a function to scrape the raw HTML content of a given URL,
and a function to scrape and prettify HTML content from a given URL.
"""

import requests
import selenium
from selenium import webdriver
from flask import jsonify
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time


# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager


def scrape_with_selenium2(url):
    """
    Scrapes financial data from Yahoo Finance using Selenium.

    :param url: URL of the Yahoo Finance Income Statement page.
    :return: Pandas DataFrame containing financial metrics and values.
    """

    path = os.getenv("DRIVER_PATH")
    options = Options()
    options.headless = (
        False  # Run headlessly if you want to avoid opening a browser window
    )

    service = ChromeService(executable_path=path)
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    time.sleep(2)
    reject_button = driver.find_element(By.NAME, "reject")
    reject_button.click()
    time.sleep(2)

    try:
        # Step 2: Open the Yahoo Finance page
        # driver.get(url)

        # Wait for the financial table to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, '//div[contains(@class, "D(tbr)")]')
            )
        )

        # Step 3: Find the financial data table
        table_rows = driver.find_elements(By.XPATH, '//div[contains(@class, "D(tbr)")]')

        if not table_rows:
            print("Error: Financial data table not found!")
            print(
                "Page Source:\n", driver.page_source[:2000]
            )  # Print part of page source for debugging
            return

        # Step 4: Extract financial data and print it
        print("\n--- Financial Data ---\n")
        for row in table_rows:
            try:
                title = row.find_element(By.XPATH, ".//span").text  # Get metric name
                value = row.find_elements(By.XPATH, ".//div")[
                    1
                ].text  # Get the latest value
                print(f"{title}: {value}")  # Print key-value pair
            except Exception as e:
                print(f"Skipping a row due to error: {e}")

    except Exception as e:
        print("Error extracting data:", e)

    finally:
        # Step 5: Close the browser
        driver.quit()

    # def scrape_with_selenium2(url):
    """
    Scrapes financial data from Yahoo Finance using Selenium.

    :param url: URL of the Yahoo Finance Income Statement page.
    :return: Pandas DataFrame containing financial metrics and values.
    """

    path = os.getenv("DRIVER_PATH")
    options = Options()
    options.headless = (
        False  # Run headlessly if you want to avoid opening a browser window
    )

    service = ChromeService(executable_path=path)
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    time.sleep(2)
    reject_button = driver.find_element(By.NAME, "reject")
    reject_button.click()
    time.sleep(2)

    try:
        # Step 2: Open Yahoo Finance page

        time.sleep(3)  # Wait for the page to load

        # Step 3: Locate the financial data table
        table = driver.find_element(
            By.XPATH, '//div[@class="D(tbrg)"]'
        )  # Main table container
        rows = table.find_elements(
            By.XPATH, './/div[contains(@class, "D(tbr)")]'
        )  # Get all table rows

        # Step 4: Extract financial metric titles and values
        financial_data = {}

        for row in rows:
            try:
                title = row.find_element(
                    By.XPATH, ".//span"
                ).text  # Get the metric name
                value = row.find_elements(By.XPATH, ".//div")[
                    1
                ].text  # Get the latest value
                financial_data[title] = value
            except Exception as e:
                print(f"Skipping row due to error: {e}")

        # Step 5: Convert extracted data to a Pandas DataFrame
        df = pd.DataFrame(list(financial_data.items()), columns=["Metric", "Value"])

    except Exception as e:
        print("Error extracting data:", e)
        df = None  # Return None in case of failure

    finally:
        # Step 6: Close the browser
        driver.quit()
    print(df)
    return "done"


def scrape_with_selenium(url):
    # Specify the path to the ChromeDriver executable
    path = os.getenv("DRIVER_PATH")

    # Set up Chrome options
    options = Options()
    options.headless = (
        False  # Run headlessly if you want to avoid opening a browser window
    )

    # Automatically installs chromedriver
    # driver = webdriver.Chrome(
    #     service=Service(ChromeDriverManager().install()), options=options
    # )

    # Initialize the WebDriver
    service = ChromeService(executable_path=path)
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get(url)

        # Find the button named 'reject' and click on it
        time.sleep(2)
        # Change the website language to English using Chrome's automatic translation
        driver.execute_script(
            "document.querySelector('html').setAttribute('lang', 'en')"
        )
        time.sleep(2)

        reject_button = driver.find_element(By.NAME, "reject")
        reject_button.click()
        time.sleep(2)

        search_bar = driver.find_element(By.ID, "ybar-sbq")
        search_bar.send_keys("bmw.de")
        time.sleep(2)
        search_bar.send_keys("\ue007")  # Press Enter key
        time.sleep(3)

        financials_link = driver.find_element(
            By.CSS_SELECTOR,
            "a[href='/quote/BMW.DE/financials/']",
            # By.CSS_SELECTOR,
            # "a[href='/quote/BMW.DE/analysis/']",
        )
        financials_link.click()
        time.sleep(3)

        page_title = driver.title  # get the title of the page

        page_source = driver.page_source  # Get the raw HTML content of the page
        time.sleep(2)

        # Use BeautifulSoup to prettify the HTML content
        soup = BeautifulSoup(page_source, "html.parser")
        prettified_html = soup.prettify()

        scrape_result = f"Scraped Page Title: {page_title}\nPrettified Page Source:\n{prettified_html}"
        return scrape_result
    finally:
        driver.quit()  # Ensure the driver is closed


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


def scrape_with_bs4(url: str):
    """
    Scrapes the content of the given URL and returns the prettified HTML.

    Parameters:
      url (str): The URL of the website to scrape.

    Returns:
      str: The prettified HTML content of the page, or an error message.
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

        # Return the entire HTML content, formatted with indentation.
        pretified_html = soup.prettify()
        return pretified_html

    except Exception as e:
        # If an error occurs, return a message with the error details.
        return {"status": "failure", "error": f"An error occurred: {e}"}