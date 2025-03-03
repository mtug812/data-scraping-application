"""
This module provides functionality for handling scraped data files in a Flask application.
It includes functions to write raw HTML content to a text file and to serve the text file
for download.
"""

import os
import uuid
from flask import send_file, jsonify

# DATA_FILE_TXT = "scraped_raw_data.txt"
# Ensure the directory for storing scraped data exists
SCRAPED_DATA_DIR = "scraped_data"
os.makedirs(SCRAPED_DATA_DIR, exist_ok=True)


def save_scraped_data(data):
    """
    Saves scraped data to a uniquely named text file using a UUID.

    Args:
        data (str): The scraped content to be saved.

    Returns:
        str: The generated filename where the data is saved.
    """

    # Generate a random UUID for the filename
    file_id = str(uuid.uuid4())
    filename = f"scraped_data_{file_id}.txt"

    # Define the full file path
    save_path = os.path.join(SCRAPED_DATA_DIR, filename)

    try:
        # Write scraped data to the file
        with open(save_path, "w", encoding="utf-8") as file:
            file.write(data)

        return filename  # Return the unique filename

    except Exception as e:
        print(f"Error saving scraped data: {e}")
        return None  # Return None if saving fails


# def scraped_data_to_txt_file(scrape_result):
#     """
#     Writes raw HTML content to a text file.

#     Args:
#         scrape_result (str): The raw HTML content to be written to the file.

#     Returns:
#         None
#     """
#     with open(DATA_FILE_TXT, "w", encoding="utf-8") as file:
#         file.write(scrape_result)


# Serve TXT file for download
# this part is a frontend part


def get_latest_scraped_file():
    """
    Retrieve the most recently saved scraped data file from the 'scraped_data' directory.

    Returns:
        str: The file path of the latest scraped file, or None if no file exists.
    """
    # Get a list of all .txt files in the directory
    files = [
        os.path.join(SCRAPED_DATA_DIR, f)
        for f in os.listdir(SCRAPED_DATA_DIR)
        if f.endswith(".txt")
    ]

    if not files:
        return None

    # Get the most recently created file
    latest_file = max(files, key=os.path.getctime)
    return latest_file


def get_txt_file():
    """
    Retrieve the latest scraped data file for download.

    Returns:
        Flask Response: Sends the latest scraped file as a download or returns an error message if unavailable.
    """
    latest_file = get_latest_scraped_file()

    if latest_file:
        return send_file(
            latest_file,
            mimetype="text/plain",
            as_attachment=True,
            download_name=os.path.basename(latest_file),
        )

    return jsonify({"error": "No scraped data available"}), 404
