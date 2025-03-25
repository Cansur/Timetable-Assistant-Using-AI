from apps.models import db

class Lecture(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 자동 증가 ID
    name = db.Column(db.String(100), nullable=False)  # 교과목명
    credit = db.Column(db.Integer, nullable=False)  # 학점
    category = db.Column(db.String(50), nullable=True)  # 이수구분
    professor = db.Column(db.String(100), nullable=True)  # 담당교수
    schedule = db.Column(db.String(100), nullable=True)  # 수업시간
    classroom = db.Column(db.String(100), nullable=True)  # 강의실
    enrolled_students = db.Column(db.Integer, default=0)  # 담은 인원
    remarks = db.Column(db.Text, nullable=True)  # 비고

    def __repr__(self):
        return f"<Lecture {self.name} ({self.professor})>"
