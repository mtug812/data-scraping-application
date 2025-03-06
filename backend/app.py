"""
This module provides a Flask web application for scraping static
websites and saving the output to a TXT file.
It includes endpoints for scraping a website, downloading the scraped content as a TXT file, user
authentication, and managing user history.
Endpoints:
- /scrape (POST): Scrapes a static website using the specified method (requests or bs4) and saves
the output to a TXT file.
- /download/txt (GET): Downloads the scraped content as a TXT file.
- /login (GET): Authenticates a user and starts a session.
- /logout (GET): Logs out the current user.
- /sign-up (POST): Registers a new user.
- /history (GET): Retrieves the scraping history of the logged-in user.
"""

import os
from os import path
from datetime import datetime, timedelta
from functools import wraps
from config import app, db
from flask import request, jsonify, session
from core.scraper import (
    scrape_with_bs4,
    scrape_with_requests,
    scrape_with_selenium,
)

# from core.file_handler import save_scraped_data, get_txt_file
from core.repository import store_user_history
from core.models import User, History
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager
from flask_login import login_user, login_required, logout_user, current_user
import jwt


def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"Alert!": "Token is missing!"}), 401

        # Ensure token follows "Bearer <token>" format
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
        else:
            return (
                jsonify({"Alert!": "Invalid token format. Use 'Bearer <token>'"}),
                401,
            )

        try:
            jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"Message": "Token expired"}), 401
        except jwt.DecodeError:
            return jsonify({"Message": "Invalid token. Unable to decode."}), 401

        return func(*args, **kwargs)

    return decorated


@app.route("/auth")
@token_required
def auth():
    return "JWT is verified. Welcome to your dashboard!"


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
    # Ensure the URL starts with "https://"
    if url.startswith("www."):
        url = "https://" + url[4:]

    if not scraping_method:
        return jsonify({"error": "Scraping method is required", "status": 2}), 400

    if scraping_method == "requests":
        # call the scrape website func for the scraped result
        scrape_result = scrape_with_requests(url)
    elif scraping_method == "bs4":
        # call the scrape website func for the scraped result
        scrape_result = scrape_with_bs4(url)
    elif scraping_method == "selenium":
        # call the scrape website func for the scraped result
        scrape_result = scrape_with_selenium(url)
    else:
        return jsonify({"error": "Invalid scraping method", "status": 2}), 400

    # Store scrape result to db only if the request has a valid token
    if request.headers.get("Authorization"):
        token = request.headers.get("Authorization").split(" ")[1]
        decoded_token = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        user_id = decoded_token["user_id"]
        store_user_history(url, scraping_method, scrape_result, user_id)
        print(user_id)
    return (
        jsonify(
            {
                "message": f"URL Scraped with {scraping_method} and content saved",
                "status": 1,
                "scrape_result": scrape_result,  # this contains the scrape_result data
            }
        ),
        201,
    )


# @app.route("/download/txt", methods=["GET"])
# def download_txt():
#     """
#     Endpoint to download a text file.

#     This route handles GET requests to download a text file generated by the
#     get_txt_file function.

#     Returns:
#         Response: A Flask response object containing the text file.
#     """
#     txt_file = get_txt_file()
#     return txt_file


@app.route("/login", methods=["POST"])
def login():
    """
    Handles the login route for the application.
    This function processes a login request by extracting the email and password
    from the request JSON payload. It then checks if a user with the provided email
    exists in the database. If the user exists, it verifies the password. If the
    password is correct, the user is logged in and a success message is returned.
    Otherwise, an error message is returned indicating the issue.
    Returns:
        Response: A JSON response with a success message if login is successful,
                  or an error message if the email does not exist or the password
                  is incorrect.
        JSON response with a status key:
        - status: 1 -> success
        - status: 2 -> error
    """
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if user:
        if check_password_hash(user.password, password):
            login_user(user, remember=True)
            token = jwt.encode(
                {
                    "user": email,  # Store email in token
                    "user_id": user.id,  # Store user_id in token
                    "exp": datetime.utcnow() + timedelta(seconds=1000),
                },
                app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            return jsonify(
                {"message": "Logged in successfully!", "status": 1, "token": token}
            )
        else:
            return jsonify({"error": "Incorrect password, try again.", "status": 2})
    else:
        return jsonify({"error": "Email does not exist.", "status": 2})


@app.route("/logout")
@login_required
# @token_required
def logout():
    """
    Logs out the current user.

    This route is protected by the @login_required decorator, ensuring that only authenticated
    users can access it.
    Upon successful logout, the user session is terminated, and a JSON response is returned
    indicating the logout status.

    Returns:
        Response: A JSON response with a message indicating successful logout.
    """
    logout_user()
    return jsonify({"Message": "Logged out successfully.", "status": 1})


@app.route("/sign-up", methods=["POST"])
def sign_up():
    """
    Handle user sign-up requests.
    This endpoint allows users to create a new account by providing their email,
    first name, and password. It performs various validations on the input data
    and returns appropriate error messages if any validation fails. If the
    input data is valid, a new user is created, added to the database, and
    logged in.
    Returns:
        Response: A JSON response containing a success message and status code
        if the account is created successfully, or an error message and status
        code if any validation fails.
    """
    email = request.json.get("email")
    username = request.json.get("userName")
    password = request.json.get("password")
    repeat_password = request.json.get("repeat_password")

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Email already exists.", "status": 2})
    elif len(email) < 4:
        return jsonify(
            {"error": "Email must be greater than 3 characters.", "status": 2}
        )
    elif len(username) < 2:
        return jsonify(
            {"error": "First name must be greater than 1 character.", "status": 2}
        )
    elif password != repeat_password:
        return jsonify({"error": "Passwords don't match.", "status": 2})
    elif len(password) < 7:
        return jsonify(
            {"error": "Password must be at least 7 characters.", "status": 2}
        )
    else:
        new_user = User(
            email=email,
            username=username,
            password=generate_password_hash(password, method="pbkdf2:sha256"),
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Account created successfully!", "status": 1})


@app.route("/history", methods=["GET"])
def history():
    """
    Fetches and returns the history of scraped data for the currently logged-in user.
    This endpoint is protected by the @login_required decorator, ensuring that only authenticated
    users can access it.
    Returns:
        Response: A JSON response containing a list of dictionaries, each representing a history
        record with the following keys:
            - url (str): The URL that was scraped.
            - scraped_data (str): The content that was scraped from the URL.
            - date (str): The date and time when the data was scraped,
            formatted as "%Y-%m-%d %H:%M:%S".
        HTTP Status Code:
            200: If the history is successfully retrieved.
    """
    # Extract user_id from the token
    token = request.headers.get("Authorization").split(" ")[1]
    decoded_token = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    user_id = decoded_token["user_id"]
    print(user_id)

    user_history = (
        History.query.filter_by(user_id=user_id).order_by(History.date.desc()).all()
    )

    history_list = [
        {
            "url": record.url,
            "scraped_data": record.scraped_data,
            "date": record.date.strftime("%Y-%m-%d %H:%M:%S") if record.date else None,
        }
        for record in user_history
    ]

    return jsonify(history_list), 200


login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


if __name__ == "__main__":
    with app.app_context():
        if not path.exists("instance/" + "database.db"):
            # if not path.exists("instance/" + str(os.getenv("DATABASE_NAME"))):
            db.create_all()
            print("Database created!")
        app.run(debug=True)