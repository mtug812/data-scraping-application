import os
from flask import send_file, jsonify

DATA_FILE_TXT = "scraped_raw_data.txt"


<<<<<<< HEAD
def scraped_data_to_txt_file(raw_html) -> None:
=======
def scraped_data_to_txt_file(scrape_result):
>>>>>>> origin/signup_login_ali
    """
    Writes raw HTML content to a text file.

    Args:
<<<<<<< HEAD
        raw_html (str): The raw HTML content to be written to the file.
=======
        scrape_result (str): The raw HTML content to be written to the file.
>>>>>>> origin/signup_login_ali

    Returns:
        None
    """
<<<<<<< HEAD
    print(f"Writing to file: {type(raw_html)}")  # Afișează tipul de date
    print(f"First 200 chars: {raw_html[:200]}")  # Afișează un preview
    with open(DATA_FILE_TXT, "w", encoding="utf-8") as file:
        file.write(raw_html)




# Serve TXT file for download
=======
    with open(DATA_FILE_TXT, "w", encoding="utf-8") as file:
        file.write(scrape_result)

# Serve TXT file for download
# this part is a frontend part
>>>>>>> origin/signup_login_ali
def get_txt_file():
    """
    Retrieve the scraped data as a text file.

    This function checks if the text file containing scraped data exists.
    If the file exists, it sends the file as an attachment with the MIME type
    set to "text/plain" and the download name "scraped_raw_data.txt".
<<<<<<< HEAD
    If the file does not exist, it returns a JSON response with an error message
    and a 404 status code.

    Returns:
        Response: A Flask response object containing the text file as an attachment
                  if it exists, or a JSON error message with a 404 status code if it doesn't.
=======
    If the file does not exist, it returns a JSON response with an error
    message and a 404 status code.

    Returns:
        Response: A Flask response object containing the text file as an
        attachment if it exists, or a JSON error message with a 404 status
        code if it doesn't.
>>>>>>> origin/signup_login_ali
    """
    if os.path.exists(DATA_FILE_TXT):
        return send_file(
            DATA_FILE_TXT,
            mimetype="text/plain",
            as_attachment=True,
            download_name="scraped_raw_data.txt",
        )
    return jsonify({"error": "No scraped data available"}), 404
