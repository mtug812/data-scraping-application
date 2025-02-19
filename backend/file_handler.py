import os
# import json
from flask import send_file, jsonify

DATA_FILE_TXT = "scraped_raw_data.txt"
# DATA_FILE_JSON = "scraped_data.json"


# def save_json(data):
#     with open(DATA_FILE_JSON, "w", encoding="utf-8") as file:
#         # converts python data into json format
#         json.dump(data, file, ensure_ascii=False, indent=4)


def raw_html_to_txt_file(raw_html):
    with open(DATA_FILE_TXT, "w", encoding="utf-8") as file:
        file.write(raw_html)


# Serve TXT file for download
def get_txt_file():
    if os.path.exists(DATA_FILE_TXT):
        return send_file(
            DATA_FILE_TXT,
            mimetype='text/plain',
            as_attachment=True,
            download_name="scraped_raw_data.txt"
        )
    return jsonify({"error": "No scraped data available"}), 404
