from flask import Flask, request, jsonify
from flask_cors import CORS
# from view import view
from scraper import scrape_website
from file_handler import save_data, get_txt_file, save_json

app = Flask(__name__)
CORS(app)
# app.register_blueprint(view)


@app.route("/scrape", methods=["POST"])
def scrape():
    """
    Endpoint to scrape a static website and save the output to a TXT file.
    Expects a JSON body with a "url" key.
    """
    # retrieve the json data from the post request
    data = request.get_json()
    url = data.get('url')

    # if no url is provides , return an error with http 400 status(bad request)
    if not url:
        return jsonify({"error": "URL is required"}), 400

    # call the scrape website func for the scraped result
    result = scrape_website(url)
    if "error" in result:
        return jsonify(result), 500
    # save the data in the .txt
    save_data(result)

    response_data = {"url": url, "html": result}  # JSON response
    save_json(response_data)

    return jsonify(response_data)  # send json respomse to frontend


@app.route('/download/txt', methods=['GET'])
def download_txt():
    return get_txt_file()


if __name__ == '__main__':
    app.run(debug=True)
