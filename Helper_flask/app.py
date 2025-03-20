from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from apps.views.routes import routes
from apps.apis.api import api  # API Blueprint 가져오기
from apps.models import db  # models 폴더에서 db 가져오기

app = Flask(__name__)

# ✅ SQLite 데이터베이스 설정
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ✅ Flask 앱과 DB 연결
db.init_app(app)

# ✅ DB 반영 (기존 테이블 반영 + 새로운 테이블 생성)
with app.app_context():
    # db.create_all()  # 테이블 생성
    # print("Lecture 테이블이 생성되었습니다!")
    db.reflect()  # 기존 DB 테이블 가져오기
    print("기존 테이블을 가져왔습니다!")

# ✅ API 라우트 등록
app.register_blueprint(routes, url_prefix="/")
app.register_blueprint(api, url_prefix="/api")

# 실행
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
