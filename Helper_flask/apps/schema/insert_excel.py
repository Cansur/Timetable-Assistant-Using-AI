import sys
import os

# `Helper_flask` 디렉토리를 시스템 경로에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

import pandas as pd
from app import app
from apps.models import db
from apps.models.lecture import Lecture

# ✅ 엑셀 파일 읽기
df = pd.read_excel(r"D:\Cansur\Timetable-Assistant-Using-AI\Helper_flask\apps\schema\lectureData.xlsx")

# ✅ DB에 데이터 삽입
with app.app_context():
    for _, row in df.iterrows():
        lecture = Lecture(
            name=row["교과목명"],
            credit=row["학점"],
            category=row["이수구분"],
            professor=row["담당교수"],
            schedule=row["수업시간"],
            classroom=row["강의실"],
            # star=row["별점"],
            enrolled_students=row["담은인원"],
            remarks=row["비고"]
        )
        db.session.add(lecture)

    db.session.commit()
    print("엑셀 데이터 삽입 완료!")
