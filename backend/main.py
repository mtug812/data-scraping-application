from flask import request, jsonify
from config import app, db
from models import Url
from bs import scrape_url


@app.route("/api/post_url", methods=["POST"])
def post_url():
    url: str = request.json.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # scrape the URL
    scrape_url(url)

    # store to the database
    new_url: str = Url(url=url)
    try:
        db.session.add(new_url)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "URL added successfully"}), 201


@app.route("/api/urls", methods=["GET"])
def get_urls():
    urls = Url.query.all()
    json_urls = [url.to_json() for url in urls]

    return jsonify(json_urls)


@app.route("/api/remove/<int:id>", methods=["DELETE"])
def remove_url(id: int):
    url = Url.query.get(id)

    if not url:
        return jsonify({"error": "URL not found"}), 404

    db.session.delete(url)
    db.session.commit()

    return jsonify({"message": "URL removed successfully"})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
