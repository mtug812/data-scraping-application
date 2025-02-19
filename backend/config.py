from flask import Flask

from flask_sqlalchemy import SQLAlchemy  # type ignore
from flask_cors import CORS  # type ignore

app = Flask(__name__)  # create an app instance
CORS(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database1.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)  # create a database instance

