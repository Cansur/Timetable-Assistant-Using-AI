import json

def load_lectures():
    with open("data/lectureList_fixed.json", encoding="utf-8") as f:
        return json.load(f)

def filter_lectures(user_input, lecture_data):
    weekdays = ['월', '화', '수', '목', '금']
    matched_day = next((day for day in weekdays if day in user_input), None)
    category = "교양" if "교양" in user_input else "전공" if "전공" in user_input else ""

    filtered = []
    for lec in lecture_data:
        match_day = matched_day in lec.get('요일', '') if matched_day else True
        match_cat = category in lec.get('구분', '') if category else True
        if match_day and match_cat:
            filtered.append(lec)

    return filtered[:10 ]

def build_prompt(user_input, filtered_lectures, liked_feedbacks):
    preference_summary = "\n".join(f"- {f['message']}" for f in liked_feedbacks)

    format_guide = """
    다음은 출력 예시입니다. 반드시 이 **Markdown 코드 블록** 안에 표 형태로 출력해 주세요:

    ```markdown
    | 요일   | 시간           | 과목명           | 교수명 | 구분  |
    |--------|----------------|------------------|--------|-------|
    | 월/수    | 09:00~11:00, 10:00~11:00     | 자료구조 | 김지훈 | 전공 |
    시간은 단순히 '1,2교시'가 아니라 실제 시간(예: 09:00~11:00)으로 정확히 계산해서 작성해 주세요.
    1교시 = 09:00부터 1시간 간격이며, A교시는 09:00부터 1.5시간 간격입니다.

    ⚠️ 하나의 과목이 여러 요일에 걸쳐 있을 경우, 반드시 같은 줄에 출력하세요.
    요일은 /로 묶고, 시간은 각 요일별로 쉼표로 나열하세요.
    설명은 표 아래 한두 줄만 간단히 적어주세요.

    절대 일반 텍스트로 표를 흉내내지 말고, 위와 같은 Markdown 표 문법을 그대로 사용하세요.
    """

    return f"""
    당신은 시간표 추천 챗봇입니다.

    아래는 사용자에게 '좋아요'를 받은 이전 시간표 설명입니다:
    {preference_summary or '좋아요를 받은 시간표가 아직 없습니다.'}

    사용자 입력 조건: "{user_input}"

    조건에 맞는 강의 목록은 다음과 같습니다:
    {json.dumps(filtered_lectures, ensure_ascii=False, indent=2)}

    {format_guide}

    이 선호도와 강의 목록을 바탕으로 새로운 시간표를 추천하세요.
    """.strip()