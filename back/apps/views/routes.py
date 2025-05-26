from flask import Blueprint, Flask, render_template, request, jsonify
import random 

routes = Blueprint("routes", __name__)

@routes.route('/')
def hello_world():
    return render_template('index.html')

@routes.route('/chat')
def chat_world():
    return render_template('chat.html')

@routes.route('/chat2')
def chat2_world():
    return render_template('chat2.html')

@routes.route('/statistics')
def statistics_world():
    return render_template('statistics.html')

@routes.route("/api/track-recommend", methods=["POST"])
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

# @routes.route('/layout-static.html')
# def layout_static():
#     return render_template('temp/layout-static.html')

# @routes.route('/layout-sidenav-light.html')
# def layout_sidenav_light():
#     return render_template('temp/layout-sidenav-light.html')

# @routes.route('/login.html')
# def login():
#     return render_template('temp/login.html')

# @routes.route('/register.html')
# def register():
#     return render_template('temp/register.html')

# @routes.route('/tables.html')
# def tables():
#     return render_template('temp/tables.html')

# @routes.route('/charts.html')
# def charts():
#     return render_template('temp/charts.html')

# @routes.route('/404')
# def forgot_password():
#     return render_template('temp/404.html')

@routes.route('/test')
def test():
    return render_template('temp/test.html')

@routes.route('/track-recommend')
def track_recommend_page():
    return render_template('track_recommend.html')