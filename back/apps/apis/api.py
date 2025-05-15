from flask import Blueprint, request, jsonify
import os
import requests
from dotenv import load_dotenv
from ..utils.lecture_utils import load_lecture_data, filter_lectures, build_prompt


# 🔹 환경 변수 로드
load_dotenv()
OPENAI_API_KEY = os.getenv("VITE_OPENAI_API_KEY")
api = Blueprint("api", __name__)

# ✅ 1. GPT 질문 처리
@api.route("/ask", methods=["POST"])
def ask(prompt):
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "너는 시간표 추천 도우미야."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        res = requests.post(url, headers=headers, json=payload)
        res.raise_for_status()
        return res.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        print("GPT 호출 오류:", e)
        return "GPT 응답 중 오류가 발생했습니다. 나중에 다시 시도해주세요."

@api.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_input = data.get('input', '')
    feedback_log = data.get('feedbackLog', [])

    # 예: 강의 데이터를 불러오기
    lecture_data = load_lecture_data()

    # 사용자 입력에 따라 필터링
    filtered_lectures = filter_lectures(user_input, lecture_data)

    # 프롬프트 생성
    prompt = build_prompt(user_input, filtered_lectures, feedback_log)

    # 프롬프트를 ask()에 넘겨줘야 함
    result = ask(prompt)  # 여기서 prompt가 빠지면 지금 에러 발생

    return jsonify({"reply": result})



# ✅ 2. 특정 강의 조회(여러 조건) (READ)
@api.route("/lectures", methods=["GET"])
def get_lectures():
    # 쿼리 파라미터 받기
    name = request.args.get("name")
    credit = request.args.get("credit", type=int)
    category = request.args.get("category")
    professor = request.args.get("professor")

    # 기본 쿼리 생성
    query = Lecture.query

    # 조건 필터링
    if name:
        query = query.filter(Lecture.name.ilike(f"%{name}%"))  # 부분 일치 검색
    if credit is not None:
        query = query.filter(Lecture.credit == credit)
    if category:
        query = query.filter(Lecture.category == category)
    if professor:
        query = query.filter(Lecture.professor.ilike(f"%{professor}%"))

    # 최대 100개만 가져오기
    lectures = query.limit(100).all()

    # JSON 응답 반환
    return jsonify([
        {
            "id": lecture.id,
            "name": lecture.name,
            "credit": lecture.credit,
            "category": lecture.category,
            "professor": lecture.professor,
            "schedule": lecture.schedule,
            "classroom": lecture.classroom,
            "enrolled_students": lecture.enrolled_students,
            "remarks": lecture.remarks
        } for lecture in lectures
    ]), 200
