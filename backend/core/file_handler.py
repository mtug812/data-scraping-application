"""
This module provides functionality for handling scraped data files in a Flask application.
It includes functions to write raw HTML content to a text file and to serve the text file
for download.
"""

import os
import uuid
from flask import send_file, jsonify


# DATA_FILE_TXT = "scraped_raw_data.txt"

txt_file_name = None


def scraped_data_to_txt_file(scrape_result):
    """
    Writes raw HTML content to a text file.

    Args:
        scrape_result (str): The raw HTML content to be written to the file.

    Returns:
        None
    """
    # file_name = uuid.uuid4()
    # print(file_name)
    global txt_file_name
    txt_file_name = uuid.uuid4()
    os.makedirs("txt_files", exist_ok=True)
    with open(f"txt_files/{txt_file_name}.txt", "w", encoding="utf-8") as file:
        file.write(scrape_result)
    print(txt_file_name)
    # with open(DATA_FILE_TXT, "w", encoding="utf-8") as file:
    #     file.write(scrape_result)


# Serve TXT file for download
# this part is a frontend part
def get_txt_file():
    """
    Retrieve the scraped data as a text file.

    This function checks if the text file containing scraped data exists.
    If the file exists, it sends the file as an attachment with the MIME type
    set to "text/plain" and the download name "scraped_raw_data.txt".
    If the file does not exist, it returns a JSON response with an error
    message and a 404 status code.

    Returns:
        Response: A Flask response object containing the text file as an
        attachment if it exists, or a JSON error message with a 404 status
        code if it doesn't.
    """
    # print(txt_file_name)
    file_path = f"{txt_file_name}.txt"
    print(file_path)
    # print(f"Checking if path exists: {file_path}")
    # print(os.path.exists(file_path))
    # print(os.path.exists(f"{txt_file_name}.txt"))

    if os.path.exists(f"txt_files/{txt_file_name}.txt"):
        print("path exists!!!!!!!!!!!!!")
        return send_file(
            f"txt_files/{txt_file_name}.txt",
            mimetype="text/plain",
            as_attachment=True,
            download_name=f"{txt_file_name}.txt",
        )
    return jsonify({"error": "No scraped data available"}), 404
