"""
This module defines the History model for the data scraping application.

The History model represents a record of a web scraping activity, including the URL scraped,
the method used for scraping, the data obtained, the date of the scraping,
and the user who performed the scraping.
"""

from config import db
from flask_login import UserMixin
from sqlalchemy.sql import func


class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(512), nullable=False)
    scrape_method = db.Column(db.String(20), nullable=False)
    scraped_data = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    username = db.Column(db.String(150))
    password = db.Column(db.String(150))
    history = db.relationship("History")
