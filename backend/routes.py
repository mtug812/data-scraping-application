from flask import request, jsonify

# from models import Url
from backend.scraper import scrape_with_bs4
from config import app
from file_handler import raw_html_to_txt_file

raw_html: object = None


@app.route("/scrape_with_bs4", methods=["POST"])
def post_url():
    data: object = request.json
    url: str = data.get("url")
    # prompt: str = data.get("prompt" : "Clean the HTML content") # default prompt

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # get html content of the URL and prettify it with BeautifulSoup and requests
    raw_html: object = scrape_with_bs4(url)

    # clean the raw_html with OpenAI
    # clean_data = clean_html_with_openai(prompt, raw_html)

    # store url to the database
    # url_to_db(url)

    return jsonify(raw_html)


@app.route("/scrape_with_bs4", methods=["GET"])
def download_html():
    raw_html_to_txt_file(raw_html)
    # return jsonify(raw_html)


# def url_to_db(url):
#     url: str = Url(url=url)
#     try:
#         db.session.add(url)
#         db.session.commit()
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

#     return jsonify({"message": "URL stored successfully to database"}), 201


# @app.route("/api/urls", methods=["GET"])
# def get_urls():
#     urls = Url.query.all()
#     json_urls = [url.to_json() for url in urls]

#     return jsonify(json_urls)


# @app.route("/api/remove_url/<int:id>", methods=["DELETE"])
# def remove_url(id: int):
#     url = Url.query.get(id)

#     if not url:
#         return jsonify({"error": "URL not found"}), 404

#     db.session.delete(url)
#     db.session.commit()

#     return jsonify({"message": "URL removed successfully"})
