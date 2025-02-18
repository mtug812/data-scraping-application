import requests
from bs4 import BeautifulSoup
from flask import jsonify


def scrape_with_bs4(url: str):
    response = requests.get(url, timeout=10)
    print("Scraping URL with bs4...")

    if response.status_code != 200:
        return (
            jsonify({"status": "failure", "error": "Failed to retrieve content."}),
            400,
        )

    soup = BeautifulSoup(response.text, "html.parser")
    html_pretified = soup.prettify()

    # raw_html_to_db(html_pretified)

    return jsonify({"html_pretified": html_pretified})


# store the raw scraped data to the database as a BLOB
# def raw_html_to_db(pretofied_data):
#     raw_scraped_data = Scraped_raw(scraped_raw_data=pretofied_data)
#     try:
#         db.session.add(raw_scraped_data)
#         db.session.commit()
#         print("Raw Scraped data saved to database")
#     except Exception as e:
#         print(f"Error saving to database: {str(e)}")


# send the raw scraped data to AI for cleaning
