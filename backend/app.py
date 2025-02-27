"""
This module provides a Flask web application for scraping static
websites and saving the output to a TXT file.
It includes endpoints for scraping a website, downloading the scraped content as a TXT file, user authentication, and managing user history.
Endpoints:
- /scrape (POST): Scrapes a static website using the specified method (requests or bs4) and saves the output to a TXT file.
- /download/txt (GET): Downloads the scraped content as a TXT file.
- /login (GET): Authenticates a user and starts a session.
- /logout (GET): Logs out the current user.
- /sign-up (POST): Registers a new user.
- /history (GET): Retrieves the scraping history of the logged-in user.
"""

import os
from os import path
from config import app, db
from flask import request, jsonify
from core.scraper import scrape_with_bs4, scrape_with_requests
from core.file_handler import scraped_data_to_txt_file, get_txt_file
from core.repository import store_user_history
from core.models import User, History
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager
from flask_login import login_user, login_required, logout_user, current_user


@app.route("/scrape", methods=["POST"])
def scrape():
    """
    Expects a JSON body with the following keys:
    - "url": The URL of the website to scrape (required).
    - "scraping_method": The method to use for scraping, either "requests" or "bs4" (required).
    Returns:
    - JSON response with a status key:
        - status: 1 -> success
        - status: 2 -> error
    - HTTP status code:
        - 201 on success
        - 400 on error
    The function performs the following steps:
    1. Retrieves the JSON data from the POST request.
    2. Validates the presence of "url" and "scraping_method" in the JSON body.
    3. Calls the appropriate scraping function based on the "scraping_method".
    4. Saves the scraped data to a TXT file.
    5. If the user is authenticated, stores the scraping history.
    6. Returns a JSON response indicating the result of the operation.
    """
    # retrieve the json data from the post request
    data = request.json
    url = data.get("url")
    scraping_method = data.get("scraping_method")

    # if no url is provides , return an error with http 400 status(bad request)
    if not url:
        return jsonify({"error": "URL is required", "status": 2}), 400
    if not scraping_method:
        return jsonify({"error": "Scraping method is required", "status": 2}), 400

    if scraping_method == "requests":
        # call the scrape website func for the scraped result
        scrape_result = scrape_with_requests(url)
    elif scraping_method == "bs4":
        # call the scrape website func for the scraped result
        scrape_result = scrape_with_bs4(url)
    else:
        return jsonify({"error": "Invalid scraping method", "status": 2}), 400

    scraped_data_to_txt_file(scrape_result)
    if current_user.is_authenticated:
        store_user_history(url, scraping_method, scrape_result, current_user.id)
    return (
        jsonify(
            {
                "message": f"URL Scraped with {scraping_method} and content saved",
            }
        ),
        201,
    )


@app.route("/download/txt", methods=["GET"])
def download_txt():
    """
    Endpoint to download a text file.

    This route handles GET requests to download a text file generated by the
    get_txt_file function.

    Returns:
        Response: A Flask response object containing the text file.
    """
    txt_file = get_txt_file()
    return txt_file


@app.route("/login", methods=["GET"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if user:
        if check_password_hash(user.password, password):
            login_user(user, remember=True)
            return jsonify({"message": "Logged in successfully!"})
        else:
            return jsonify({"error": "Incorrect password, try again."})
    else:
        return jsonify({"error": "Email does not exist."})


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"Message": "Logged out successfully."})


@app.route("/sign-up", methods=["POST"])
def sign_up():
    email = request.json.get("email")
    first_name = request.json.get("firstName")
    password1 = request.json.get("password1")
    password2 = request.json.get("password2")

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Email already exists."})
    elif len(email) < 4:
        return jsonify({"error": "Email must be greater than 3 characters."})
    elif len(first_name) < 2:
        return jsonify({"error": "First name must be greater than 1 character."})
    elif password1 != password2:
        return jsonify({"error": "Passwords don't match."})
    elif len(password1) < 7:
        return jsonify({"error": "Password must be at least 7 characters."})
    else:
        new_user = User(
            email=email,
            first_name=first_name,
            password=generate_password_hash(password1, method="pbkdf2:sha256"),
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)
        return jsonify({"message": "Account created successfully!"})


login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/history", methods=["GET"])
@login_required
def history():
    user_history = (
        History.query.filter_by(user_id=current_user.id)
        .order_by(History.date.desc())
        .all()
    )

    history_list = [
        {
            "url": record.url,
            "scraped_data": record.content,
            "date": record.date.strftime("%Y-%m-%d %H:%M:%S") if record.date else None,
        }
        for record in user_history
    ]

    return jsonify(history_list), 200


if __name__ == "__main__":
    with app.app_context():
        if not path.exists("instance/" + str(os.getenv("DATABASE_NAME"))):
            db.create_all()
            print("Database created!")
        app.run(debug=True)
