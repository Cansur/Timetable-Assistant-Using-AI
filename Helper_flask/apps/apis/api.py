from flask import Blueprint, jsonify, request
from apps.models.lecture import Lecture

api = Blueprint("api", __name__)

# ✅ 1. 전체 강의 목록 조회 (READ)
# 여기서 instance폴더에 있는 database.db에 있는 Lecture 테이블을 가져와서 데이터를 전송하는 식인데,
# 지금 파일에 있는 코드를 보면 database.db자체가 없다.
# 하지만, 왜 이 코드가 작동하지??

# -추론 : SQLAlchemy 세션이 캐싱되어 있어서 Lecutre 클래스가 이미 DB에 연결되어 있기 때문이다.
@api.route("/lectures", methods=["GET"])
def get_lectures():
    lectures = Lecture.query.all()
    return jsonify([
        {
            "id": lecture.id, 
            "name": lecture.name
        }
        for lecture in lectures
    ]), 200

# ✅ 2. 특정 강의 조회 (READ)
@api.route("/lectures/<int:lecture_id>", methods=["GET"])
def get_lecture(lecture_id):
    lecture = Lecture.query.get(lecture_id)
    if not lecture:
        return jsonify({"error": "Lecture not found"}), 404
    return jsonify({
        "id": lecture.id, 
        "name": lecture.name, 
        "credit": lecture.credit,
        "category": lecture.category,
        "professor": lecture.professor,
        "schedule": lecture.schedule,
        "classroom": lecture.classroom,
        "enrolled_students": lecture.enrolled_students,
        "remarks": lecture.remarks
        }), 200

# # ✅ 3. 강의 추가 (CREATE)
# @api.route("/lectures", methods=["POST"])
# def add_lecture():
#     data = request.json
#     if not data.get("title"):
#         return jsonify({"error": "Title is required"}), 400

#     new_lecture = Lecture(title=data["title"], description=data.get("description", ""))
#     db.session.add(new_lecture)
#     db.session.commit()

#     return jsonify({"message": "Lecture added", "id": new_lecture.id}), 201

# # ✅ 4. 강의 수정 (UPDATE)
# @api.route("/lectures/<int:lecture_id>", methods=["PUT"])
# def update_lecture(lecture_id):
#     lecture = Lecture.query.get(lecture_id)
#     if not lecture:
#         return jsonify({"error": "Lecture not found"}), 404

#     data = request.json
#     lecture.title = data.get("title", lecture.title)
#     lecture.description = data.get("description", lecture.description)
#     db.session.commit()

#     return jsonify({"message": "Lecture updated"}), 200

# # ✅ 5. 강의 삭제 (DELETE)
# @api.route("/lectures/<int:lecture_id>", methods=["DELETE"])
# def delete_lecture(lecture_id):
#     lecture = Lecture.query.get(lecture_id)
#     if not lecture:
#         return jsonify({"error": "Lecture not found"}), 404

#     db.session.delete(lecture)
#     db.session.commit()

#     return jsonify({"message": "Lecture deleted"}), 200
