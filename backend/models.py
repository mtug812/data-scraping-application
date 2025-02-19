from config import db
from sqlalchemy import BLOB


class Url(db.Model):  # type: ignore # create a model class
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2000), nullable=False)

    def to_json(self) -> dict:  # type: ignore # convert the object to JSON
        return {"id": self.id, "url": self.url}


class Scraped_raw(db.Model):  # type: ignore # create a model class
    id = db.Column(db.Integer, primary_key=True)
    # scraped_raw_data = db.Column(BLOB)
    scraped_raw_data = db.Column(db.String, nullable=False)

    def to_json(self) -> dict:  # type: ignore # convert the object to JSON
        return {"id": self.id, "scraped_raw_data": self.scraped_raw_data}


# class Scraped_cleaned(db.Model):  # type: ignore # create a model class
#     id = db.Column(db.Integer, primary_key=True)
#     cleaned_data = db.Column(db.String(2000), nullable=False)

#     def to_json(self) -> dict:  # type: ignore # convert the object to JSON
#         return {"id": self.id, "cleaned_data": self.cleaned_data}
