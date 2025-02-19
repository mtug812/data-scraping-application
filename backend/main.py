from config import app, db

# make sure to import the models
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

