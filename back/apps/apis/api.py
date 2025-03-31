from flask import Blueprint, jsonify, request
from apps.models.lecture import Lecture

api = Blueprint("api", __name__)

# ✅ 1. 전체 강의 목록 조회 (READ)
# 여기서 instance폴더에 있는 database.db에 있는 Lecture 테이블을 가져와서 데이터를 전송하는 식인데,
# 지금 파일에 있는 코드를 보면 database.db자체가 없다.
# 하지만, 왜 이 코드가 작동하지??

# -추론 : SQLAlchemy 세션이 캐싱되어 있어서 Lecutre 클래스가 이미 DB에 연결되어 있기 때문이다.


# @api.route("/lectures", methods=["GET"])
# def get_lectures():
#     lectures = Lecture.query.all()
#     return jsonify([
#         {
#             "id": lecture.id, 
#             "name": lecture.name, 
#             "credit": lecture.credit,
#             "category": lecture.category,
#             "professor": lecture.professor,
#             "schedule": lecture.schedule,
#             "classroom": lecture.classroom,
#             "enrolled_students": lecture.enrolled_students,
#             "remarks": lecture.remarks
#         }
#         for lecture in lectures
#     ]), 200

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
        # query = query.filter(Lecture.category.ilike(f"%{category}%"))
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