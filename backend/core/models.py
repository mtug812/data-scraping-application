from config import db
from flask_login import UserMixin
from sqlalchemy.sql import func
# from datetime import datetime


class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(10000))
    scraped_data = db.Column(db.Text)
    scraping_method = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    history = db.relationship('History')
