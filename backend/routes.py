from flask import request, jsonify
from config import app
# from view import view
from scraper import scrape_with_bs4
from file_handler import raw_html_to_txt_file, get_txt_file

raw_html: object = None

# smth to change
@app.route("/scrape_with_bs4", methods=["POST"])
def scrape():
    """
    Endpoint to scrape a static website and save the output to a TXT file.
    Expects a JSON body with a "url" key.
    """
    # retrieve the json data from the post request
    data: object = request.json
    url: str = data.get('url')

    # if no url is provides , return an error with http 400 status(bad request)
    if not url:
        return jsonify({"error": "URL is required"}), 400

    # call the scrape website func for the scraped result
    raw_html = scrape_with_bs4(url)
    # if "error" in raw_html:
    #     return jsonify(raw_html), 500
    # save the data in the .txt
    # raw_html_to_txt_file(raw_html)

    # response_data = {"url": url, "html": raw_html}  # JSON response
    # save_json(response_data)

    return jsonify(raw_html)  # send json respomse to frontend


@app.route('/download/txt', methods=['GET'])
def download_txt():
    raw_html_to_txt_file(raw_html)
    return get_txt_file()