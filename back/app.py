from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

import os

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
db_path = os.path.join("instance", "database.db")
with app.app_context():
    if not os.path.exists(db_path):  # 데이터베이스 파일이 없으면 생성
        db.create_all()
        print("📌 새 데이터베이스 생성 및 테이블 생성 완료!")
    else:  # 기존 DB가 있으면 테이블을 반영
        db.reflect()
        print("✅ 기존 테이블을 반영했습니다!")

# ✅ API 라우트 등록
app.register_blueprint(routes, url_prefix="/")
app.register_blueprint(api, url_prefix="/api")

# 실행
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
