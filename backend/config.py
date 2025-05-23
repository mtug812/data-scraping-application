"""
This module sets up the configuration for a Flask application, including
loading environment variables, enabling CORS, and configuring the SQLAlchemy
database connection.
Modules:
    os: Provides a way of using operating system dependent functionality.
    dotenv: Loads environment variables from a .env file.
    flask: A micro web framework for Python.
    flask_sqlalchemy: Adds SQLAlchemy support to Flask applications.
    flask_cors: Enables Cross-Origin Resource Sharing (CORS) for Flask
    applications.
Attributes:
    app (Flask): The Flask application instance.
    db (SQLAlchemy): The SQLAlchemy database instance.
"""

import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)  # create an app instance
CORS(app)
CORS(app, supports_credentials=True)

# Load environment variables from .env file
load_dotenv()
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")


# Database configuration
database_uri = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)  # create a database instance
