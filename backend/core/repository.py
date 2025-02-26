from core.models import History
from config import db
from flask_login import login_required


@login_required
def store_user_history(url, raw_html, scraped_method, current_user_id):
    new_history = History(url=url, scraped_data=raw_html,
                          scraping_method=scraped_method,
                          user_id=current_user_id)
    db.session.add(new_history)
    db.session.commit()
