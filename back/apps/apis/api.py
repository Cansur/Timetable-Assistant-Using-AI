from flask import Blueprint, request, jsonify
import random
import os
import requests
from dotenv import load_dotenv
from ..utils.lecture_utils import load_lectures, filter_lectures, build_prompt
from apps.models.lecture import Lecture


# 🔹 환경 변수 로드
load_dotenv()
OPENAI_API_KEY = os.getenv("VITE_OPENAI_API_KEY")
api = Blueprint("api", __name__)

# GPT 질문 처리 (내부 함수로 변경)
def _call_gpt(prompt):
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
    except requests.RequestException as e:
        error_detail = res.json().get('error', str(e)) if res else str(e)
        raise Exception(f"GPT 호출 실패: {error_detail}")

# 공통 입력 검증 및 데이터 처리
def _process_request():
    if request.content_type != 'application/json':
        return jsonify({
            "error": "Unsupported Media Type",
            "detail": "Content-Type must be 'application/json'"
        }), 415

    try:
        data = request.get_json()
        user_input = data.get('input')
        feedback_log = data.get('feedbackLog', [])

        if not isinstance(user_input, str) or not user_input.strip():
            return jsonify({
                "error": "Invalid input",
                "detail": "Input must be a non-empty string"
            }), 400
        
        if not isinstance(feedback_log, list):
            return jsonify({
                "error": "Invalid feedbackLog",
                "detail": "feedbackLog must be a list"
            }), 400

        lecture_data = load_lectures()
        filtered_lectures = filter_lectures(user_input, lecture_data)
        prompt = build_prompt(user_input, filtered_lectures, feedback_log)
        return None, (prompt, user_input, filtered_lectures)
    except Exception as e:
        return jsonify({
            "error": "Invalid JSON",
            "detail": str(e)
        }), 400

# /api/ask 엔드포인트
@api.route("/ask", methods=["POST"])
def ask():
    error_response, result = _process_request()
    if error_response:
        return error_response
    
    prompt, _, _ = result
    try:
        gpt_reply = _call_gpt(prompt)
        return jsonify({"reply": gpt_reply})
    except Exception as e:
        return jsonify({
            "error": "GPT 호출 실패",
            "detail": str(e)
        }), 500

# /api/recommend 엔드포인트 (필터링된 강의 정보와 GPT 응답 함께 반환)
@api.route("/recommend", methods=["POST"])
def recommend():
    error_response, result = _process_request()
    if error_response:
        return error_response
    
    prompt, user_input, filtered_lectures = result
    try:
        gpt_reply = _call_gpt(prompt)
        return jsonify({
            "reply": gpt_reply,
            "lectures": filtered_lectures,
            "input": user_input
        })
    except Exception as e:
        return jsonify({
            "error": "GPT 호출 실패",
            "detail": str(e)
        }), 500


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


@api.route("/track-recommend", methods=["POST"])
def api_track_recommend():
    # 전공별 학년별 과목 목록
    track_subjects = {
        "빅데이터": {
            "1학년": ["자바프로그래밍 I", "이산구조론", "파이썬과학프로그래밍기초", "C프로그래밍"],
            "2학년": ["자료구조", "C프로그래밍", "데이터사이언스기초", "컴퓨터구조"],
            "3학년": ["머신러닝", "데이터마이닝", "운영체제", "프로그래밍이론"],
            "4학년": ["시스템보안", "클라우드컴퓨팅", "빅데이터개론", "계산이론"]
        },
        "콘텐츠IT": {
            "1학년": ["자바프로그래밍 I", "이산구조론", "C프로그래밍"],
            "2학년": ["자료구조", "데이터베이스기초", "파이썬과학프로그래밍기초"],
            "3학년": ["소프트웨어공학", "윈도우프로그래밍", "웹프로그래밍", "정보보호론"],
            "4학년": ["게임프로그래밍", "머신러닝응용", "영상처리와딥러닝", "HCI"]
        },
        "스마트IoT": {
            "1학년": ["자바프로그래밍 I", "이산구조론", "선형대수"],
            "2학년": ["C프로그래밍", "신호및시스템", "데이터사이언스기초", "회로이론 및 실험"],
            "3학년": ["IoT네트워크", "오픈소스하드웨어응용", "통신네트워크시스템", "블록체인"],
            "4학년": ["네트워크보안", "고급임베디드시스템", "소프트웨어캡스톤디자인", "임베디드시스템"]
        }
    }

    # 프론트에서 보낸 데이터 받기
    data = request.get_json()
    track = data.get("track")   # 예: 빅데이터
    grade = data.get("grade")   # 예: 3학년

    # 유효성 검사
    if not track or not grade or track not in track_subjects or grade not in track_subjects[track]:
        return jsonify({"error": "잘못된 전공 또는 학년입니다."}), 400

    # 랜덤 추천 (최대 3개)
    candidates = track_subjects[track][grade]
    subjects = random.sample(candidates, k=min(3, len(candidates)))

    return jsonify({"subjects": subjects})