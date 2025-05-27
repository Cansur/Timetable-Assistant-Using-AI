from flask import Blueprint, render_template, request

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

@routes.route('/compare')
def compare_world():
    return render_template('compare.html')

@routes.route('/track_recommend', methods=["GET", "POST"])
def track_recommend_page():
    recommendations = None

    if request.method == "POST":
        grade = request.form.get("grade")  # ex: "1"
        major = request.form.get("major")  # ex: "빅데이터"

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

        grade_key = f"{grade}학년"
        recommendations = track_subjects.get(major, {}).get(grade_key, ["추천 과목 없음"])

    return render_template("track_recommend.html", recommendations=recommendations)
