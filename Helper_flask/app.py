from flask import Flask, render_template
from apps.home import home
from apps.api import api  # api blueprint 가져오기

app = Flask(__name__)

# home Blueprint 등록
app.register_blueprint(home, url_prefix="/")

# REST API Blueprint 등록
app.register_blueprint(api, url_prefix="/api")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)