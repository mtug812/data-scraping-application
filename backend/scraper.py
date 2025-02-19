import requests
from flask import jsonify
from bs4 import BeautifulSoup


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
        print("Scraping URL eith bs4...")

        # Check if the response was successful (status code 200).
        if response.status_code != 200:
            return (
                jsonify({"status": "failure", "error": "Failed to retrieve content"}),
                400,
            )

        # parse the html content using beautifullsp
        soup = BeautifulSoup(response.text, 'html.parser')

        # Return the entire HTML content, formatted with indentation.
        return soup.prettify()

    except requests.exceptions.RequestException as e:
        # If an error occurs, return a message with the error details.
        return f"An error occurred: {e}"
