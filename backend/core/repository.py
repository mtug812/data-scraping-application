"""
This module provides functionality to store user scraping history in the database.
Functions:
    store_user_history(url, scrape_method, scrape_result, current_user_id):
    Stores the scraping history of a user in the database.
"""

from core.models import History
from config import db
from flask_login import login_required


def store_user_history(url, scrape_method, scrape_result, current_user_id):
    """
    Stores the user's scraping history in the database.

    Args:
        url (str): The URL that was scraped.
        scrape_method (str): The method used for scraping.
        scrape_result (str): The result of the scraping process.
        current_user_id (int): The ID of the current user.

    Returns:
        None
    """
    new_history = History(
        url=url,
        scrape_method=scrape_method,
        scraped_data=scrape_result,
        user_id=current_user_id,
    )
    db.session.add(new_history)
    db.session.commit()
    print("user history saved to database")
