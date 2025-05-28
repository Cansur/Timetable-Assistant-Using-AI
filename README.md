</br>

# 캡스톤 디자인 - 헬퍼


## 1. 프로젝트 소개
자신이 수강하고자 하는 강의 목록, 선호하는 시간대, 공강 요일, 특정 교수에 대한 선호도 등 다양한 정보를 입력할 수 있으며, AI는 이를 기반으로 시간 충돌이 없고 사용자의 조건을 최대한 반영한 최적의 시간표를 자동으로 생성할 수 있습니다.

</br>

## 2. 소개 영상

https://github.com/user-attachments/assets/8573ca0f-993e-4096-b6b7-289d1c24bf0b


<br>

## 3. 프로젝트 기능
#### 1️⃣ AI 시간표 생성 및 적용
ChatGPT API를 통해 AI가 사용자의 간단한 입력만으로 시간표를 자동 생성합니다. 생성된 시간표는 사용자 선택 후 자신의 시간표에 바로 적용할 수 있으며, 알파벳 교시(A, B)와 시간대(09:00~10:30) 형식을 정확히 지원해 가독성을 높였습니다.

#### 2️⃣ 추천 시간표 비교
AI가 생성한 여러 시간표를 한 화면에 나란히 표시하여 강의 배치, 요일별 강의 밀집도, 공강 여부, 학점 합계 등 다양한 요소를 쉽게 비교할 수 있습니다. 이를 통해 각 시간표의 장단점을 빠르게 파악하고, 자신에게 맞는 시간표를 선택할 수 있습니다.

#### 3️⃣ 시간표 분석 기능
선택한 시간표의 전체 학점, 요일별 강의 분포, 공강 요일 유무, 특정 요일의 과밀 여부 등을 한눈에 볼 수 있는 분석 기능을 제공합니다. 단순히 시간표를 확인하는 것을 넘어, 학습 계획 최적화에 필요한 정보를 제공합니다.

#### 4️⃣ 간편한 웹 서비스 구조
Flask 기반의 백엔드 서버를 오라클 클라우드(OCI)에 배포해 AI 연동, 웹 렌더링, API 제공까지 통합적으로 처리합니다. SQLite로 강의 데이터를 관리하고, 사용자 시간표는 로컬스토리지에 저장하여 서버 부하를 줄였습니다.

<br>

## 4. 팀원 소개
|Backend|AI|AI|
|:---:|:---:|:---:|
|빅데이터 4학년|콘텐츠 IT 4학년|콘텐츠 IT 4학년|
|이선재|남현우|김태빈|
<br>

## 5. 기술 스택
### BackEnd :
<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white"> <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=raspberrypi&logoColor=white"> <img src="https://img.shields.io/badge/Flask--RESTX-009688?style=for-the-badge&logo=flask&logoColor=white">

<br>

## 6. 시스템 구조

![image](https://github.com/user-attachments/assets/3c736d03-9b18-4546-9c6d-2099a9358798)

<br>
<br>
<br>
<br>
