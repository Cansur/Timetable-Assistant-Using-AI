# 베이스 이미지로 Python 3.12.7 사용
FROM python:3.12.7

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사
COPY requirements.txt .

# 종속성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 컨테이너 실행 시 실행할 명령어
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]