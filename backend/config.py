from flask import Flask
<<<<<<< HEAD
from flask_sqlalchemy import SQLAlchemy  # type ignore
from flask_cors import CORS  # type ignore

app = Flask(__name__)  # create an app instance
CORS(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database1.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)  # create a database instance
=======
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# app.register_blueprint(view)
>>>>>>> 005fbb6 (final backend for first strategy)
