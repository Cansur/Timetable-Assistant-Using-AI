from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

import requests
import os
from dotenv import load_dotenv

from apps.views.routes import routes
from apps.apis.api import api  # API Blueprint 가져오기
from apps.models import db  # models 폴더에서 db 가져오기


load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')

OPENAI_API_KEY = os.getenv("VITE_OPENAI_API_KEY")

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

# gpt 질문
@app.route('/api/ask', methods=['POST'])
def ask():
    prompt = request.json.get('prompt', '')

    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json',
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "너는 시간표 추천 도우미야."},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)

    if response.ok:
        content = response.json()['choices'][0]['message']['content']
        return jsonify({ "response": content })
    else:
        return jsonify({ "error": "GPT 호출 실패", "detail": response.text }), 500

# 실행
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
