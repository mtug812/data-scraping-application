import requests
from models import Scraped_raw
from config import db
from bs4 import BeautifulSoup


def scrape_url(url: str):
    response = requests.get(url)
    print("Scraping URL...")
    print(response.status_code)
    data = BeautifulSoup(response.text, "html.parser")
    data_pretified = data.prettify()

    if response.status_code == 200:
        scraped_raw_to_txt(data_pretified)
        scraped_raw_to_db(data_pretified)
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")


# store the raw scraped data to a file
def scraped_raw_to_txt(prettified_data):
    with open("scraped.txt", "w") as file:  # w overwrites the existing file
        file.write(str(prettified_data))
        print("Raw Scraped data saved to scraped.txt")


# store the raw scraped data to the database as a BLOB
def scraped_raw_to_db(pretofied_data):
    raw_scraped_data = Scraped_raw(scraped_raw_data=pretofied_data)
    try:
        db.session.add(raw_scraped_data)
        db.session.commit()
        print("Raw Scraped data saved to database")
    except Exception as e:
        print(f"Error saving to database: {str(e)}")


# send the raw scraped data to AI for cleaning
