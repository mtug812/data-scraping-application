from config import db
from core.models import History
from flask_login import login_required


@login_required
def store_user_history(url, scrape_method, scrape_result, current_user_id):
    new_history = History(
        url=url,
        scrape_method=scrape_method,
        scraped_data=scrape_result,
        user_id=current_user_id,
    )
    db.session.add(new_history)
    db.session.commit()
    print("user history saved to database")
