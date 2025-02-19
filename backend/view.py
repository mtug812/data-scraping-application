from flask import Blueprint

view = Blueprint(__name__, "view")


@view.route("/")
def home():
    return "still not ready "
